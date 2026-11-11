import type { BrandId } from './brand.js';

export interface TaxRate {
  id: string;
  name: string;
  rate: number; // 100000 = 1%
}

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  min: number;
  max: number | null;
  options: ModifierOption[];
}

export interface MenuItem {
  id: string;
  sku: string | null;
  name: string;
  price: number;
  available: boolean;
  description: string;
  image: string | null;
  categoryIds: string[];
  taxRates: TaxRate[];
  modifierGroups: ModifierGroup[];
}

export interface MenuSection {
  id: string;
  name: string;
  itemIds: string[];
}

export interface Menu {
  brand: BrandId;
  sections: MenuSection[];
  items: MenuItem[];
  updatedAt: string;
}

/** Seed data for one modifier group: options are [name, priceInCents]. */
export interface SeedGroup {
  name: string;
  min: number;
  max: number;
  options: [name: string, price: number][];
}

/** [sku, name, priceInCents, description, image, modifierGroupKeys] */
export type SeedItem = [sku: string, name: string, price: number, description: string, image: string | null, groups: string[]];

export interface SeedMenu {
  groups: Record<string, SeedGroup>;
  categories: [name: string, items: SeedItem[]][];
}
