import { rest, ecomm } from './clover/client.js';
import type { Brand } from '../types/brand.js';
import type { CloverLineItem, CloverList, CloverPayment, EcommRefund } from '../types/clover.js';
import type { Order } from '../types/order.js';

export function getPayment(brand: Brand, paymentId: string) {
  return rest(brand).get<CloverPayment>(`/payments/${paymentId}?expand=order,cardTransaction`);
}

/**
 * Finds the Clover payment for a hosted checkout session when no webhook has
 * arrived (local development). Looks at successful payments created after the
 * session for the same amount, then matches our reference in a line-item note,
 * falling back to an exact line-item match.
 */
export async function findCheckoutPayment(brand: Brand, order: Order, claimed: Set<string>): Promise<CloverPayment | null> {
  const api = rest(brand);
  const since = Date.parse(order.checkout.createdTime) - 60_000;
  const filter = encodeURIComponent(`createdTime>=${since}`);
  const { elements = [] } = await api.get<CloverList<CloverPayment>>(`/payments?filter=${filter}&expand=order&limit=50`);
  const want = order.lines.map((l) => `${l.unitPrice}x${l.quantity}`).sort().join();
  for (const p of elements) {
    if (p.result !== 'SUCCESS' || claimed.has(p.id) || !p.order?.id) continue;
    if (p.amount - (p.tipAmount || 0) !== order.totals.total) continue;
    const lines = await api.all<CloverLineItem>(`/orders/${p.order.id}/line_items`);
    if (lines.some((l) => l.note?.includes(order.ref))) return p;
    const counts = new Map<number, Map<string, number>>();
    for (const l of lines) {
      const byName = counts.get(l.price) ?? new Map<string, number>();
      byName.set(l.name, (byName.get(l.name) ?? 0) + 1);
      counts.set(l.price, byName);
    }
    const have = [...counts].flatMap(([price, byName]) => [...byName.values()].map((n) => `${price}x${n}`)).sort().join();
    if (want === have) return p;
  }
  return null;
}

/** Ecommerce API view of an order (status, amounts, charges). */
export function getEcommOrder(brand: Brand, cloverOrderId: string) {
  return ecomm(brand).get<Record<string, unknown>>(`/v1/orders/${cloverOrderId}`);
}

/** Full refund of a charge through the Ecommerce API. */
export function refundCharge(brand: Brand, paymentId: string, reason: string, idempotencyKey: string) {
  return ecomm(brand).post<EcommRefund>('/v1/refunds', { charge: paymentId, reason }, { 'idempotency-key': idempotencyKey });
}
