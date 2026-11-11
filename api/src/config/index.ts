import type { Brand, BrandId, DayHours } from '../types/brand.js';

const env = process.env;

const sandbox = (env.CLOVER_ENV || 'sandbox') !== 'production';

export const clover = {
  sandbox,
  restBase: sandbox ? 'https://sandbox.dev.clover.com' : 'https://api.clover.com',
  ecommBase: sandbox ? 'https://scl-sandbox.dev.clover.com' : 'https://scl.clover.com',
  checkoutBase: sandbox ? 'https://apisandbox.dev.clover.com' : 'https://api.clover.com',
} as const;

export const port = Number(env.PORT || 4000);
/** Off unless explicitly enabled in production, so a dev server can't take real orders by accident. */
export const orderingEnabled = (env.ORDERING_ENABLED ?? (sandbox ? 'true' : 'false')) === 'true';
export const adminToken = env.ADMIN_TOKEN || '';
export const dataDir = env.DATA_DIR || 'data';

function credentials(prefix: string) {
  return {
    merchantId: env[`${prefix}_CLOVER_MERCHANT_ID`] || env.CLOVER_MERCHANT_ID || '',
    restToken: env[`${prefix}_CLOVER_REST_TOKEN`] || env.CLOVER_REST_TOKEN || '',
    ecommToken: env[`${prefix}_CLOVER_ECOMM_PRIVATE_TOKEN`] || env.CLOVER_ECOMM_PRIVATE_TOKEN || '',
    webhookSecret: env[`${prefix}_CLOVER_WEBHOOK_SECRET`] || env.CLOVER_WEBHOOK_SECRET || '',
  };
}

/** Category filter from env (a regex source), with a default for the live POS layout. */
function categoryFilter(prefix: string, fallback: string) {
  return new RegExp(env[`${prefix}_MENU_EXCLUDE`] || fallback, 'i');
}

// Both live POS systems carry Italian and Mexican categories, plus bar and
// system categories. These keep each site to its own cuisine and off alcohol.
const SHARED_EXCLUDE = 'print options|orderintegrations|margarita|beer|wine|mixed drinks|happy hour|liquor';
const excludeTags = (env.MENU_EXCLUDE_TAGS ?? 'Liquor,Beer,Wine').split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);

/** Same hours Monday–Saturday, different on Sunday. */
const week = (weekday: DayHours, sunday: DayHours): DayHours[] => [sunday, weekday, weekday, weekday, weekday, weekday, weekday];

export const brands: Record<BrandId, Brand> = {
  italian: {
    id: 'italian',
    name: 'Bella Cucina of the Lake',
    tag: env.ITALIAN_CLOVER_TAG ?? 'bella-italian',
    siteUrl: env.ITALIAN_SITE_URL || 'http://localhost:3101',
    phone: '(540) 388-4430',
    address: '4444 Germanna Highway, Locust Grove, VA 22508',
    timeZone: 'America/New_York',
    hours: week(['08:00', '22:00'], ['08:00', '21:00']),
    prepMinutes: 20,
    excludeCategories: categoryFilter('ITALIAN', `^mexican|${SHARED_EXCLUDE}`),
    excludeTags,
    ...credentials('ITALIAN'),
  },
  mexican: {
    id: 'mexican',
    name: 'Bella Cucina Mexican',
    tag: env.MEXICAN_CLOVER_TAG ?? 'bella-mexican',
    siteUrl: env.MEXICAN_SITE_URL || 'http://localhost:3102',
    phone: '(540) 412-5009',
    address: '4444 Germanna Highway, Locust Grove, VA 22508',
    timeZone: 'America/New_York',
    hours: week(['11:00', '22:00'], ['11:00', '21:00']),
    prepMinutes: 20,
    excludeCategories: categoryFilter('MEXICAN', `italian|pizza|turnover|subs\\b|burgers|soups|${SHARED_EXCLUDE}`),
    excludeTags,
    ...credentials('MEXICAN'),
  },
};

export const brandIds = Object.keys(brands) as BrandId[];

export const allowedOrigins = new Set(
  [...Object.values(brands).map((b) => new URL(b.siteUrl).origin), ...(env.EXTRA_ORIGINS || '').split(',')].filter(Boolean),
);

export function getBrand(id: string): Brand {
  const brand = brands[id as BrandId];
  if (!brand) throw new Error(`Unknown brand "${id}"`);
  if (!brand.merchantId || !brand.restToken || !brand.ecommToken)
    throw new Error(`Clover credentials are missing for brand "${id}". See api/.env.example.`);
  return brand;
}
