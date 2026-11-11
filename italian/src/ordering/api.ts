import { BRAND } from "./brand";

export const API_URL = process.env.NEXT_PUBLIC_ORDER_API_URL || "http://localhost:4000";

export type ModifierOption = { id: string; name: string; price: number };
export type ModifierGroup = { id: string; name: string; min: number; max: number | null; options: ModifierOption[] };
export type MenuItem = {
  id: string;
  name: string;
  price: number;
  available: boolean;
  description: string;
  image: string | null;
  modifierGroups: ModifierGroup[];
};
export type MenuSection = { id: string; name: string; itemIds: string[] };
export type Menu = { sections: MenuSection[]; items: MenuItem[] };
export type Slot = { at: string; label: string };
export type StoreInfo = {
  name: string;
  phone: string;
  address: string;
  openNow: boolean;
  asapMinutes: number;
  slots: Slot[];
  sandbox: boolean;
  /** False while online ordering is switched off: menu only, call to order. */
  orderingEnabled: boolean;
};
export type QuoteLine = {
  itemId: string;
  name: string;
  modifiers: { id: string; name: string; price: number; groupName: string }[];
  note: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};
export type Quote = { lines: QuoteLine[]; subtotal: number; tax: number; total: number };
export type OrderStatus = "awaiting_payment" | "paid" | "failed" | "expired" | "refunded";
export type Order = {
  ref: string;
  brand: string;
  status: OrderStatus;
  createdAt: string;
  firstName: string;
  pickup: { asap: boolean; at: string; label: string };
  note: string;
  lines: QuoteLine[];
  totals: { subtotal: number; tax: number; total: number };
  checkoutUrl: string | null;
  checkoutExpiresAt: string;
  payment: { cardType: string | null; last4: string | null; paidAt: string } | null;
};
export type CartLine = { itemId: string; quantity: number; modifierIds: string[]; note: string };
export type Customer = { firstName: string; lastName: string; email: string; phone: string };

export class ApiError extends Error {
  constructor(message: string, public itemId?: string) {
    super(message);
  }
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(API_URL + path, {
      ...init,
      headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    });
  } catch {
    throw new ApiError("We can’t reach our ordering system right now. Please try again, or give us a call.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || "Something went wrong. Please try again.", data.itemId);
  return data as T;
}

const post = (body: unknown): RequestInit => ({ method: "POST", body: JSON.stringify(body) });

export const api = {
  menu: () => call<Menu>(`/api/${BRAND}/menu`),
  info: () => call<StoreInfo>(`/api/${BRAND}/info`, { cache: "no-store" }),
  quote: (items: CartLine[]) => call<Quote>(`/api/${BRAND}/quote`, post({ items })),
  placeOrder: (body: { items: CartLine[]; customer: Customer; pickup: { asap: true } | { at: string }; note: string }) =>
    call<Order>(`/api/${BRAND}/orders`, post(body)),
  order: (ref: string) => call<Order>(`/api/orders/${encodeURIComponent(ref)}`, { cache: "no-store" }),
};

export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
