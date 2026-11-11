import { rest } from './clover/client.js';
import type { Brand } from '../types/brand.js';
import type { CloverOrderType } from '../types/clover.js';
import type { Order } from '../types/order.js';

const ORDER_TYPE_LABEL = 'Online Pickup';
const orderTypeIds = new Map<string, string>();

async function onlineOrderTypeId(brand: Brand): Promise<string> {
  const cached = orderTypeIds.get(brand.merchantId);
  if (cached) return cached;
  const api = rest(brand);
  const types = await api.all<CloverOrderType>('/order_types');
  const type =
    types.find((t) => t.label === ORDER_TYPE_LABEL) ||
    (await api.post<CloverOrderType>('/order_types', { label: ORDER_TYPE_LABEL, taxable: true, isDefault: false, filterCategories: false, isHidden: false }));
  orderTypeIds.set(brand.merchantId, type.id);
  return type.id;
}

/**
 * Labels the paid Clover order for the kitchen (title, pickup note, "Online
 * Pickup" order type) and links the Clover customer. Each step is best-effort;
 * failures are returned rather than thrown, because the guest has already paid.
 */
export async function labelPaidOrder(brand: Brand, order: Order, cloverOrderId: string): Promise<string[]> {
  const api = rest(brand);
  const pickup = order.pickup.asap ? 'ASAP' : order.pickup.label;
  const { firstName, lastName, phone, cloverId } = order.customer;
  const note = [
    `Online ${brand.name} order ${order.ref}`,
    `Pickup: ${pickup}`,
    `${firstName} ${lastName} · ${phone}`,
    order.note && `Note: ${order.note}`,
  ]
    .filter(Boolean)
    .join('\n');

  const steps = [
    async () =>
      api.post(`/orders/${cloverOrderId}`, {
        title: `${order.ref} · ${firstName} · ${pickup}`.slice(0, 99),
        note: note.slice(0, 2000),
        orderType: { id: await onlineOrderTypeId(brand) },
      }),
    async () => cloverId && api.post(`/orders/${cloverOrderId}`, { customers: [{ id: cloverId }] }),
  ];
  const errors: string[] = [];
  for (const step of steps) await step().catch((e: Error) => errors.push(e.message));
  return errors;
}
