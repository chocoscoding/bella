/**
 * Menu content that Clover inventory does not hold (descriptions, photos),
 * keyed by Clover item SKU. scripts/seed-menu.ts also uses this to create the
 * sandbox inventory, so names and prices here are the seed values only:
 * once seeded, Clover is the source of truth for name, price and availability.
 *
 * Italian prices for the four featured dishes come from the current site;
 * every other price is a sandbox placeholder to confirm against the real menu.
 */
import type { SeedGroup, SeedMenu } from '../types/menu.js';
import type { BrandId } from '../types/brand.js';

const g = (name: string, min: number, max: number, options: SeedGroup['options']): SeedGroup => ({ name, min, max, options });

const italianGroups = {
  pastaChoice: g('Choice of', 1, 1, [['Meatballs', 0], ['Sausage', 0], ['Mushrooms', 0]]),
  addProtein: g('Add protein', 0, 1, [['Grilled chicken', 400], ['Shrimp', 600]]),
  toppings: g('Toppings', 0, 6, [['Pepperoni', 200], ['Sausage', 200], ['Mushrooms', 150], ['Onions', 150], ['Green peppers', 150], ['Extra cheese', 200]]),
};
const mexicanGroups = {
  protein: g('Protein', 1, 1, [['Chicken', 0], ['Ground beef', 0], ['Steak', 200], ['Carnitas', 150], ['Shrimp', 300]]),
  sauce: g('Sauce', 1, 1, [['Red', 0], ['Green', 0], ['Cheese', 0]]),
  extras: g('Extras', 0, 4, [['Guacamole', 250], ['Sour cream', 100], ['Jalapeños', 75], ['Extra cheese', 150]]),
};

export const seedMenus: Record<BrandId, SeedMenu> = {
  italian: {
    groups: italianGroups,
    categories: [
      ['Pasta', [
        ['ita-01', 'Spaghetti', 1475, 'A familiar favorite with your choice of meatballs, sausage, or mushrooms.', '/images/spaghetti.webp', ['pastaChoice']],
        ['ita-02', 'Baked Ziti', 1475, 'Penne, ricotta, and mozzarella baked with tomato sauce.', '/images/ziti.webp', ['addProtein']],
        ['ita-03', 'Fettuccine Alfredo', 1525, 'Ribbons of fettuccine in a rich parmesan cream sauce.', null, ['addProtein']],
      ]],
      ['Seafood', [
        ['ita-11', 'Linguini Alia Pescatore', 2175, 'Linguini with shrimp, calamari, mussels, and clams in marinara.', '/images/seafood.webp', []],
        ['ita-12', 'Shrimp Scampi', 1825, 'Angel hair with shrimp, garlic, olive oil, and white wine.', '/images/scampi.webp', []],
      ]],
      ['Pizza', [
        ['ita-21', 'Cheese Pizza (14")', 1500, 'Hand-tossed, tomato sauce and whole-milk mozzarella. Build it your way.', '/images/pizza-slice-spatula.png', ['toppings']],
        ['ita-22', 'Pepperoni Pizza (14")', 1700, 'Our classic pie loaded with pepperoni.', '/images/hero-pizza-fork.png', ['toppings']],
      ]],
      ['Italian favorites', [
        ['ita-31', 'Chicken Piccata', 1895, 'Tender chicken in a lemon, butter and caper sauce over pasta.', '/images/piccata.webp', []],
        ['ita-32', 'Chicken Parmigiana', 1795, 'Breaded chicken, marinara and melted mozzarella with spaghetti.', null, []],
      ]],
      ['Dessert', [
        ['ita-41', 'Tiramisu', 750, 'Espresso-soaked ladyfingers and mascarpone cream.', '/images/dessert.webp', []],
        ['ita-42', 'Cannoli', 595, 'Crisp shells filled with sweet ricotta.', null, []],
      ]],
    ],
  },
  mexican: {
    groups: mexicanGroups,
    categories: [
      ['Tacos & more', [
        ['mex-01', 'Tacos', 1299, 'Three warm tortillas, fresh cilantro and a squeeze of lime.', '/images/plates/tacos.jpg', ['protein', 'extras']],
        ['mex-02', 'Burrito el Grande', 1499, 'A generous burrito with rice, beans and pico de gallo.', '/images/plates/burrito.jpg', ['protein', 'extras']],
        ['mex-03', 'Enchiladas', 1399, 'Smothered in sauce, with lettuce, cheese and rice.', '/images/plates/enchiladas.jpg', ['protein', 'sauce']],
      ]],
      ['To share', [
        ['mex-11', 'Loaded Nachos', 1349, 'Golden chips, melted cheese and generous toppings.', '/images/plates/nachos.jpg', ['protein', 'extras']],
        ['mex-12', 'Chips & Salsa', 450, 'Warm tortilla chips with house salsa.', null, []],
      ]],
      ['From the grill', [
        ['mex-21', 'Shrimp & Rice', 1799, 'Saucy shrimp, rice and fresh accompaniments.', '/images/plates/shrimp.jpg', []],
        ['mex-22', 'Grilled Chicken', 1599, 'Grilled chicken, cilantro, rice and vegetables.', '/images/plates/grilled-chicken.jpg', []],
        ['mex-23', 'Steak Mexicano', 1999, 'Steak with grilled onions, peppers, rice and beans.', '/images/plates/steak-mexicano.jpg', []],
        ['mex-24', 'Carnitas', 1649, 'Golden pork, rice, beans and tortillas.', '/images/plates/carnitas.jpg', []],
      ]],
      ['Something fresh', [
        ['mex-31', 'Fiesta Chicken Salad', 1299, 'Grilled chicken, avocado, tomato and cucumber.', '/images/plates/chicken-salad.jpg', []],
      ]],
    ],
  },
};

export const menuCopy: Record<string, { description: string; image: string | null }> = Object.fromEntries(
  Object.values(seedMenus).flatMap((m) =>
    m.categories.flatMap(([, items]) => items.map(([sku, , , description, image]) => [sku, { description, image }])),
  ),
);

