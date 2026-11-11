import type { BrandId } from './brand.js';
import type { TaxRate } from './menu.js';

/* ---------- Request bodies (after express-validator sanitizing) ---------- */

export interface CartItemInput {
  itemId: string;
  quantity: number;
  modifierIds?: string[];
  note?: string;
}

export interface CustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  /** 10 digits, normalized by the validator. */
  phone: string;
}

export type PickupInput = { asap: true; at?: undefined } | { asap?: false; at: string };

export interface QuoteBody {
  items: CartItemInput[];
}

export interface PlaceOrderBody {
  items: CartItemInput[];
  customer: CustomerInput;
  pickup: PickupInput;
  note?: string;
}

export interface RefundBody {
  reason?: 'requested_by_customer' | 'duplicate' | 'fraudulent';
}

/* ---------- Domain ---------- */

export interface PricedModifier {
  id: string;
  name: string;
  price: number;
  groupName: string;
}

export interface PricedLine {
  itemId: string;
  name: string;
  modifiers: PricedModifier[];
  note: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  tax: number;
  taxRates: TaxRate[];
}

export interface Totals {
  subtotal: number;
  tax: number;
  total: number;
}

export interface PricedCart extends Totals {
  lines: PricedLine[];
}

export type QuoteLine = Omit<PricedLine, 'taxRates'>;

export interface Quote extends Totals {
  lines: QuoteLine[];
}

export interface Pickup {
  asap: boolean;
  at: string;
  label: string;
}

export type OrderStatus = 'awaiting_payment' | 'paid' | 'failed' | 'expired' | 'refunded';

export interface OrderPayment {
  id: string;
  cloverOrderId: string | null;
  amount: number;
  cardType: string | null;
  last4: string | null;
  paidAt: string;
}

export interface Order {
  ref: string;
  brand: BrandId;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  customer: CustomerInput & { cloverId: string | null };
  pickup: Pickup;
  note: string;
  lines: QuoteLine[];
  totals: Totals;
  checkout: {
    sessionId: string;
    href: string;
    createdTime: string;
    expirationTime: string;
    redirects: boolean;
  };
  payment: OrderPayment | null;
  kitchen?: { labeledAt: string; errors: string[] };
  refund?: { id: string; amount: number; at: string };
}

/** What the storefront may see about an order: no email, phone or Clover ids. */
export interface PublicOrder {
  ref: string;
  brand: BrandId;
  status: OrderStatus;
  createdAt: string;
  firstName: string;
  pickup: Pickup;
  note: string;
  lines: QuoteLine[];
  totals: Totals;
  checkoutUrl: string | null;
  checkoutExpiresAt: string;
  payment: Pick<OrderPayment, 'cardType' | 'last4' | 'paidAt'> | null;
}

export interface Slot {
  at: string;
  label: string;
}

export interface PickupWindow {
  openNow: boolean;
  asapMinutes: number;
  slots: Slot[];
}
