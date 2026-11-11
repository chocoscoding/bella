// Seeds the Clover SANDBOX inventory with both brands' online menus.
// Idempotent: items are matched by SKU, everything else by name.
// Usage: npm run seed            (both brands)
//        npm run seed -- italian (one brand)
import { brands, clover } from '../src/config/index.js';
import { rest } from '../src/services/clover/client.js';
import { seedMenus } from '../src/data/menu-copy.js';
import type { CloverCategory, CloverItem, CloverModifierGroup, CloverTag } from '../src/types/clover.js';

if (!clover.sandbox) {
  console.error('Refusing to seed: CLOVER_ENV is production.');
  process.exit(1);
}

const only = process.argv[2];
for (const brand of Object.values(brands)) {
  if (only && brand.id !== only) continue;
  // Seeding writes inventory; only ever do it to the shared test merchant, where brands are split by tag.
  if (!brand.tag) {
    console.error(`Skipping ${brand.name}: no *_CLOVER_TAG, so this looks like a real merchant.`);
    continue;
  }
  const api = rest(brand);
  const menu = seedMenus[brand.id];
  console.log(`\n▸ ${brand.name} (merchant ${brand.merchantId}, tag "${brand.tag}")`);

  const [tags, categories, groups, items] = await Promise.all([
    api.all<CloverTag>('/tags'),
    api.all<CloverCategory>('/categories'),
    api.all<CloverModifierGroup>('/modifier_groups?expand=modifiers'),
    api.all<CloverItem>('/items?expand=categories,tags,modifierGroups'),
  ]);

  const tag = tags.find((t) => t.name === brand.tag) || (await api.post<CloverTag>('/tags', { name: brand.tag }));

  const groupIds: Record<string, string> = {};
  for (const [key, def] of Object.entries(menu.groups)) {
    let group = groups.find((x) => x.name === def.name && !x.deleted);
    if (!group) {
      group = await api.post<CloverModifierGroup>('/modifier_groups', { name: def.name, minRequired: def.min, maxAllowed: def.max, showByDefault: true });
      group.modifiers = { elements: [] };
      console.log(`  + modifier group ${def.name}`);
    }
    for (const [name, price] of def.options) {
      if (!group.modifiers?.elements?.some((m) => m.name === name))
        await api.post(`/modifier_groups/${group.id}/modifiers`, { name, price });
    }
    groupIds[key] = group.id;
  }

  for (const [sortOrder, [categoryName, rows]] of menu.categories.entries()) {
    let category = categories.find((c) => c.name === categoryName && !c.deleted);
    if (!category) category = await api.post<CloverCategory>('/categories', { name: categoryName, sortOrder: 10 + sortOrder });
    else if (category.sortOrder !== 10 + sortOrder) await api.post(`/categories/${category.id}`, { sortOrder: 10 + sortOrder });
    for (const [sku, name, price, , , groupKeys] of rows) {
      let item = items.find((i) => i.sku === sku && !i.deleted);
      if (!item) {
        item = await api.post<CloverItem>('/items', { name, price, sku, priceType: 'FIXED', defaultTaxRates: true, isRevenue: true });
        console.log(`  + ${name}  $${(price / 100).toFixed(2)}`);
      }
      if (!item.categories?.elements?.some((c) => c.id === category.id))
        await api.post('/category_items', { elements: [{ item: { id: item.id }, category: { id: category.id } }] });
      if (!item.tags?.elements?.some((t) => t.id === tag.id))
        await api.post('/tag_items', { elements: [{ item: { id: item.id }, tag: { id: tag.id } }] });
      for (const key of groupKeys) {
        if (!item.modifierGroups?.elements?.some((m) => m.id === groupIds[key]))
          await api.post('/item_modifier_groups', { elements: [{ item: { id: item.id }, modifierGroup: { id: groupIds[key] } }] });
      }
    }
  }
  console.log('  ✓ done');
}
