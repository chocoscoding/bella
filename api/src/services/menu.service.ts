import { rest } from './clover/client.js';
import { menuCopy } from '../data/menu-copy.js';
import { AppError } from '../utils/errors.js';
import type { Brand, BrandId } from '../types/brand.js';
import type { CloverCategory, CloverItem, CloverModifierGroup, CloverTaxRate } from '../types/clover.js';
import type { Menu, MenuItem, MenuSection } from '../types/menu.js';
import type { CartItemInput, PricedCart, PricedLine, PricedModifier } from '../types/order.js';

const TTL = 60_000;
const cache = new Map<BrandId, { at: number; menu?: Menu; pending?: Promise<Menu> }>();

/**
 * The brand's orderable menu, built from Clover inventory: items, categories,
 * modifier groups, tags and tax rates. Clover is the source of truth for names,
 * prices, availability and options; data/menu-copy.ts adds descriptions and photos.
 */
export async function getMenu(brand: Brand, { fresh = false } = {}): Promise<Menu> {
  const hit = cache.get(brand.id);
  if (!fresh && hit?.menu && Date.now() - hit.at < TTL) return hit.menu;
  const pending = hit?.pending || buildMenu(brand);
  cache.set(brand.id, { at: hit?.at ?? 0, menu: hit?.menu, pending });
  try {
    const menu = await pending;
    cache.set(brand.id, { at: Date.now(), menu });
    return menu;
  } catch (err) {
    if (hit?.menu) {
      cache.set(brand.id, { at: hit.at, menu: hit.menu });
      return hit.menu; // serve stale during a Clover outage
    }
    cache.delete(brand.id);
    throw err;
  }
}

/**
 * Drops the POS menu number from a name: "108. Quesadilla Texana", "#111 Scampi",
 * "107  Burrito Pastor", "01.Kids Pancake". A lone digit without a period is kept,
 * so "3 Tacos" stays as is.
 */
export function displayName(name: string): string {
  const cleaned = name.replace(/^\s*(?:#\s*\d+[a-z]?\.?|\d+[a-z]?\.|\d{2,}[a-z]?)\s*(?=\S)/i, '').trim();
  return cleaned || name.trim();
}


async function buildMenu(brand: Brand): Promise<Menu> {
  const api = rest(brand);
  const [items, groups, taxRates, categories] = await Promise.all([
    api.all<CloverItem>('/items?expand=categories,tags,modifierGroups,taxRates,itemStock'),
    api.all<CloverModifierGroup>('/modifier_groups?expand=modifiers'),
    api.all<CloverTaxRate>('/tax_rates'),
    api.all<CloverCategory>('/categories'),
  ]);
  const groupById = new Map(groups.map((g) => [g.id, g]));
  const defaultTaxes = taxRates.filter((t) => t.isDefault);
  const tagName = brand.tag.toLowerCase();

  const shownCategories = new Set(categories.filter((c) => !c.deleted && !brand.excludeCategories.test(c.name)).map((c) => c.id));
  const tagNames = (i: CloverItem) => (i.tags?.elements || []).map((t) => t.name.toLowerCase());

  // Online: visible, fixed and non-zero price, in at least one shown category, no excluded tag.
  const rawNames = new Map(items.map((i) => [i.id, i.name]));
  const sortKey = (m: MenuItem) => m.sku || rawNames.get(m.id) || m.name;
  const menuItems: MenuItem[] = items
    .filter((i) => !i.deleted && !i.hidden && i.priceType === 'FIXED' && i.price > 0)
    .filter((i) => !tagName || tagNames(i).includes(tagName))
    .filter((i) => !tagNames(i).some((t) => brand.excludeTags.includes(t)))
    .filter((i) => i.categories?.elements?.some((c) => shownCategories.has(c.id)))
    .map((i) => {
      const copy = (i.sku && menuCopy[i.sku]) || undefined;
      const name = displayName(i.name);
      const inStock = !i.autoManage || (i.itemStock?.quantity ?? 0) > 0;
      return {
        id: i.id,
        sku: i.sku || null,
        name,
        price: i.price,
        available: i.available !== false && inStock,
        description: copy?.description || '',
        image: null, // photos are off for now; the cards still support a thumbnail
        categoryIds: (i.categories?.elements || []).map((c) => c.id).filter((id) => shownCategories.has(id)),
        taxRates: (i.defaultTaxRates ? defaultTaxes : i.taxRates?.elements || []).map(({ id, name, rate }) => ({ id, name, rate })),
        modifierGroups: (i.modifierGroups?.elements || [])
          .map((ref) => groupById.get(ref.id))
          .filter((g): g is CloverModifierGroup => Boolean(g && !g.deleted))
          .map((g) => ({
            id: g.id,
            name: g.name,
            min: g.minRequired || 0,
            max: g.maxAllowed || null,
            options: (g.modifiers?.elements || [])
              .filter((m) => m.available !== false)
              .map((m) => ({ id: m.id, name: m.name, price: m.price || 0 })),
          })),
      };
    })
    // Keep the POS numbering order: by SKU, else by the original numbered name.
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b), undefined, { numeric: true }));

  const used = new Set(menuItems.flatMap((i) => i.categoryIds));
  const sections: MenuSection[] = categories
    .filter((c) => !c.deleted && used.has(c.id))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name))
    .map((c) => ({ id: c.id, name: c.name, itemIds: menuItems.filter((i) => i.categoryIds.includes(c.id)).map((i) => i.id) }));
  return { brand: brand.id, sections, items: menuItems, updatedAt: new Date().toISOString() };
}

const cartError = (message: string, itemId?: string) => new AppError(422, message, itemId ? { itemId } : undefined);

/**
 * Prices a cart against the live menu. Never trusts client prices.
 * Shape checks (types, quantity range, note length) happen in the validator;
 * this enforces the menu rules: item exists, in stock, valid options.
 */
export function priceCart(menu: Menu, cartItems: CartItemInput[]): PricedCart {
  const byId = new Map(menu.items.map((i) => [i.id, i]));
  const lines = cartItems.map((entry): PricedLine => {
    const item = byId.get(entry.itemId);
    if (!item) throw cartError('An item in your bag is no longer on the menu.', entry.itemId);
    if (!item.available) throw cartError(`${item.name} is sold out right now.`, item.id);
    const chosen = new Set(entry.modifierIds || []);
    const modifiers: PricedModifier[] = [];
    for (const group of item.modifierGroups) {
      const picks = group.options.filter((o) => chosen.has(o.id));
      if (picks.length < group.min) throw cartError(`Choose ${group.name.toLowerCase()} for ${item.name}.`, item.id);
      if (group.max && picks.length > group.max) throw cartError(`Choose up to ${group.max} for ${group.name.toLowerCase()}.`, item.id);
      for (const p of picks) {
        modifiers.push({ ...p, groupName: group.name });
        chosen.delete(p.id);
      }
    }
    if (chosen.size) throw cartError(`An option for ${item.name} is no longer available.`, item.id);
    const unitPrice = item.price + modifiers.reduce((s, m) => s + m.price, 0);
    const lineTotal = unitPrice * entry.quantity;
    const rate = item.taxRates.reduce((s, t) => s + t.rate, 0);
    return {
      itemId: item.id,
      name: item.name,
      modifiers,
      note: entry.note || '',
      quantity: entry.quantity,
      unitPrice,
      lineTotal,
      tax: Math.round((lineTotal * rate) / 10_000_000),
      taxRates: item.taxRates,
    };
  });
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const tax = lines.reduce((s, l) => s + l.tax, 0);
  return { lines, subtotal, tax, total: subtotal + tax };
}
