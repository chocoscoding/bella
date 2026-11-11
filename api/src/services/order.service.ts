import { getMenu, priceCart } from './menu.service.js';
import { upsertCustomer } from './customer.service.js';
import { createCheckoutSession, redirectUrlsFor } from './checkout.service.js';
import { getPayment, findCheckoutPayment, refundCharge } from './payment.service.js';
import { labelPaidOrder } from './kitchen.service.js';
import { pickupWindow, formatDay, formatTime } from './hours.service.js';
import { orderStore, newRef } from './store.service.js';
import { getBrand, orderingEnabled } from '../config/index.js';
import { AppError } from '../utils/errors.js';
import type { Brand } from '../types/brand.js';
import type { CheckoutWebhookEvent } from '../types/clover.js';
import type { CartItemInput, Order, Pickup, PickupInput, PlaceOrderBody, PublicOrder, Quote, RefundBody } from '../types/order.js';

const withoutTax = <T extends { taxRates: unknown }>({ taxRates, ...line }: T) => line;

/** Business rule check for the pickup time; the validator has already checked its shape. */
function resolvePickup(brand: Brand, input: PickupInput): Pickup {
  const window = pickupWindow(brand);
  if (input.asap) {
    if (!window.openNow) throw new AppError(422, 'We are closed right now — please choose a pickup time.');
    const at = new Date(Date.now() + window.asapMinutes * 60_000);
    return { asap: true, at: at.toISOString(), label: `ASAP (about ${window.asapMinutes} min)` };
  }
  const slot = window.slots.find((s) => s.at === input.at);
  if (!slot) throw new AppError(422, 'That pickup time is no longer available. Please choose another.');
  const at = new Date(slot.at);
  return { asap: false, at: slot.at, label: `${formatDay(at, brand.timeZone)}, ${formatTime(at, brand.timeZone)}` };
}

/** Prices a cart against live Clover inventory without creating anything. */
export async function quoteCart(brand: Brand, items: CartItemInput[]): Promise<Quote> {
  const { lines, ...totals } = priceCart(await getMenu(brand), items);
  return { lines: lines.map(withoutTax), ...totals };
}

/**
 * Prices the order, records the Clover customer and opens a Hosted Checkout
 * session. Hosted Checkout creates the Clover order when the guest pays; we
 * label it for the kitchen once payment is confirmed.
 */
export async function placeOrder(brand: Brand, body: PlaceOrderBody): Promise<Order> {
  if (!orderingEnabled) throw new AppError(503, `Online ordering isn’t open yet. Please call us at ${brand.phone} to order.`);
  const pickup = resolvePickup(brand, body.pickup);
  const cart = priceCart(await getMenu(brand, { fresh: true }), body.items);
  const ref = newRef();

  const cloverId = await upsertCustomer(brand, body.customer).catch((err: Error) => {
    console.warn(`[${ref}] customer upsert failed: ${err.message}`);
    return null;
  });

  const redirectUrls = redirectUrlsFor(brand, ref);
  const session = await createCheckoutSession(brand, { ref, customer: body.customer, cart, redirectUrls });

  return orderStore.save({
    ref,
    brand: brand.id,
    status: 'awaiting_payment',
    createdAt: new Date().toISOString(),
    customer: { ...body.customer, cloverId },
    pickup,
    note: body.note || '',
    lines: cart.lines.map(withoutTax),
    totals: { subtotal: cart.subtotal, tax: cart.tax, total: cart.total },
    checkout: {
      sessionId: session.checkoutSessionId,
      href: session.href,
      createdTime: session.createdTime,
      expirationTime: session.expirationTime,
      redirects: Boolean(redirectUrls),
    },
    payment: null,
  });
}

/** Marks an order paid from a Clover payment id and labels the Clover order. Idempotent. */
export async function confirmPayment(brand: Brand, order: Order, paymentId: string): Promise<Order> {
  if (order.payment?.id === paymentId) return order;
  const payment = await getPayment(brand, paymentId);
  if (payment.result !== 'SUCCESS') {
    order.status = 'failed';
    return orderStore.save(order);
  }
  order.status = 'paid';
  order.payment = {
    id: payment.id,
    cloverOrderId: payment.order?.id ?? null,
    amount: payment.amount,
    cardType: payment.cardTransaction?.cardType ?? null,
    last4: payment.cardTransaction?.last4 ?? null,
    paidAt: new Date(payment.createdTime).toISOString(),
  };
  await orderStore.save(order);
  if (order.payment.cloverOrderId) {
    const errors = await labelPaidOrder(brand, order, order.payment.cloverOrderId);
    if (errors.length) console.warn(`[${order.ref}] Clover order labeling: ${errors.join('; ')}`);
    order.kitchen = { labeledAt: new Date().toISOString(), errors };
    await orderStore.save(order);
  }
  return order;
}

const lastReconcile = new Map<string, number>();
const RECONCILE_EVERY_MS = 4000;

/**
 * Looks for the payment in Clover when no webhook has arrived yet (throttled
 * per order), and expires abandoned checkout sessions.
 */
export async function reconcile(order: Order): Promise<Order> {
  if (order.status !== 'awaiting_payment') return order;
  if (Date.now() - (lastReconcile.get(order.ref) ?? 0) < RECONCILE_EVERY_MS) return order;
  lastReconcile.set(order.ref, Date.now());
  const brand = getBrand(order.brand);
  const claimed = new Set((await orderStore.list()).flatMap((o) => (o.payment ? [o.payment.id] : [])));
  const payment = await findCheckoutPayment(brand, order, claimed);
  if (payment) return confirmPayment(brand, order, payment.id);
  if (Date.now() > Date.parse(order.checkout.expirationTime) + 5 * 60_000) {
    order.status = 'expired';
    await orderStore.save(order);
  }
  return order;
}

export async function getOrderForGuest(ref: string): Promise<PublicOrder> {
  const order = await orderStore.get(ref);
  if (!order) throw new AppError(404, 'We could not find that order.');
  const current = await reconcile(order).catch((err: Error) => {
    console.warn(`[${order.ref}] reconcile failed: ${err.message}`);
    return order;
  });
  return toPublicOrder(current);
}

/** Applies a Hosted Checkout webhook event. Unknown sessions are ignored. */
export async function handleCheckoutEvent(event: CheckoutWebhookEvent): Promise<boolean> {
  if (event.type !== 'PAYMENT') return false;
  const order = await orderStore.find((o) => o.checkout.sessionId === event.data);
  if (!order) return false;
  if (event.status === 'APPROVED') await confirmPayment(getBrand(order.brand), order, event.id);
  else if (order.status === 'awaiting_payment') {
    order.status = 'failed';
    await orderStore.save(order);
  }
  return true;
}

export async function refundOrder(ref: string, { reason = 'requested_by_customer' }: RefundBody): Promise<Order> {
  const order = await orderStore.get(ref);
  if (!order) throw new AppError(404, 'Order not found.');
  if (order.status !== 'paid' || !order.payment) throw new AppError(409, `Order is ${order.status}, not paid.`);
  const refund = await refundCharge(getBrand(order.brand), order.payment.id, reason, `refund-${order.ref}`);
  order.status = 'refunded';
  order.refund = { id: refund.id, amount: refund.amount, at: new Date().toISOString() };
  return orderStore.save(order);
}

export function toPublicOrder(order: Order): PublicOrder {
  return {
    ref: order.ref,
    brand: order.brand,
    status: order.status,
    createdAt: order.createdAt,
    firstName: order.customer.firstName,
    pickup: order.pickup,
    note: order.note,
    lines: order.lines,
    totals: order.totals,
    checkoutUrl: order.status === 'awaiting_payment' ? order.checkout.href : null,
    checkoutExpiresAt: order.checkout.expirationTime,
    payment: order.payment && { cardType: order.payment.cardType, last4: order.payment.last4, paidAt: order.payment.paidAt },
  };
}
