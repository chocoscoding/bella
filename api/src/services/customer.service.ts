import { rest } from './clover/client.js';
import type { Brand } from '../types/brand.js';
import type { CloverCustomer, CloverList } from '../types/clover.js';
import type { CustomerInput } from '../types/order.js';

/** Finds a Clover customer by email, or creates one. Returns the customer id. */
export async function upsertCustomer(brand: Brand, { firstName, lastName, email, phone }: CustomerInput): Promise<string> {
  const api = rest(brand);
  const filter = encodeURIComponent(`emailAddress=${email}`);
  const found = await api.get<CloverList<CloverCustomer>>(`/customers?filter=${filter}&expand=phoneNumbers&limit=1`);
  const existing = found.elements?.[0];
  if (existing) {
    const known = existing.phoneNumbers?.elements?.some((p) => p.phoneNumber.replace(/\D/g, '') === phone);
    if (!known) await api.post(`/customers/${existing.id}/phone_numbers`, { phoneNumber: phone }).catch(() => {});
    return existing.id;
  }
  const created = await api.post<CloverCustomer>('/customers', {
    firstName,
    lastName,
    marketingAllowed: false,
    emailAddresses: [{ emailAddress: email }],
    phoneNumbers: [{ phoneNumber: phone }],
  });
  return created.id;
}
