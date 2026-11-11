import { rest } from './clover/client.js';
import type { Brand } from '../types/brand.js';
import type { CloverMerchant } from '../types/clover.js';

export async function getMerchant(brand: Brand) {
  const m = await rest(brand).get<CloverMerchant>('/?expand=address');
  return { id: m.id, name: m.name, address: m.address ?? null, currency: m.defaultCurrency || 'USD' };
}
