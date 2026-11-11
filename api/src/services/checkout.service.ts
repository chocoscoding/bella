import { hostedCheckout } from './clover/client.js';
import type { Brand } from '../types/brand.js';
import type { CheckoutLineItem, CheckoutRedirectUrls, CheckoutSession } from '../types/clover.js';
import type { CustomerInput, PricedCart } from '../types/order.js';

interface SessionInput {
  ref: string;
  customer: CustomerInput;
  cart: PricedCart;
  redirectUrls: CheckoutRedirectUrls | null;
}

/**
 * Opens a Clover Hosted Checkout session. Modifiers are folded into each line's
 * name and price, since Hosted Checkout line items have no modifier field.
 */
export function createCheckoutSession(brand: Brand, { ref, customer, cart, redirectUrls }: SessionInput) {
  const lineItems: CheckoutLineItem[] = cart.lines.map((l, i) => ({
    name: [l.name, ...l.modifiers.map((m) => m.name)].join(' · ').slice(0, 127),
    price: l.unitPrice,
    unitQty: l.quantity,
    // The first note carries our reference so the paid order can be matched without a webhook.
    note: [i === 0 ? ref : '', l.note].filter(Boolean).join(' — ').slice(0, 255) || undefined,
    taxRates: l.taxRates.map((t) => ({ name: t.name, rate: t.rate, taxRateUuid: t.id })),
  }));
  return hostedCheckout(brand)<CheckoutSession>('/checkouts', {
    customer: { firstName: customer.firstName, lastName: customer.lastName, email: customer.email, phoneNumber: customer.phone },
    shoppingCart: { lineItems },
    ...(redirectUrls && { redirectUrls }),
  });
}

/** Clover only accepts https redirect URLs; local dev opens checkout in a new tab instead. */
export function redirectUrlsFor(brand: Brand, ref: string): CheckoutRedirectUrls | null {
  if (!brand.siteUrl.startsWith('https://')) return null;
  const status = `${brand.siteUrl}/order/status?ref=${ref}`;
  return { success: status, failure: `${status}&result=failed`, cancel: `${brand.siteUrl}/order?cancelled=${ref}` };
}
