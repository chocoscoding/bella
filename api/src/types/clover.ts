// Shapes of the Clover API responses this service reads. Only fields we use are listed.

export interface CloverList<T> {
  elements?: T[];
  href?: string;
}

export interface CloverRef {
  id: string;
}

export interface CloverTaxRate {
  id: string;
  name: string;
  rate: number; // 100000 = 1%
  isDefault?: boolean;
}

export interface CloverModifier {
  id: string;
  name: string;
  price?: number;
  available?: boolean;
}

export interface CloverModifierGroup {
  id: string;
  name: string;
  minRequired?: number;
  maxAllowed?: number;
  deleted?: boolean;
  modifiers?: CloverList<CloverModifier>;
}

export interface CloverCategory {
  id: string;
  name: string;
  sortOrder?: number;
  deleted?: boolean;
}

export interface CloverTag {
  id: string;
  name: string;
}

export interface CloverItem {
  id: string;
  name: string;
  sku?: string;
  price: number;
  priceType: 'FIXED' | 'VARIABLE' | 'PER_UNIT';
  hidden?: boolean;
  deleted?: boolean;
  available?: boolean;
  autoManage?: boolean;
  defaultTaxRates?: boolean;
  itemStock?: { quantity?: number };
  categories?: CloverList<CloverCategory>;
  tags?: CloverList<CloverTag>;
  modifierGroups?: CloverList<CloverRef>;
  taxRates?: CloverList<CloverTaxRate>;
}

export interface CloverCustomer {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumbers?: CloverList<{ id: string; phoneNumber: string }>;
}

export interface CloverOrderType {
  id: string;
  label: string;
}

export interface CloverLineItem {
  id: string;
  name: string;
  price: number;
  note?: string;
}

export interface CloverPayment {
  id: string;
  amount: number;
  tipAmount?: number;
  result: 'SUCCESS' | 'FAIL' | 'INITIATED' | 'VOIDED' | 'VOIDING' | 'AUTH' | string;
  createdTime: number;
  order?: CloverRef;
  cardTransaction?: { cardType?: string; last4?: string };
}

export interface CloverMerchant {
  id: string;
  name: string;
  defaultCurrency?: string;
  address?: Record<string, string>;
}

/** POST /invoicingcheckoutservice/v1/checkouts response. */
export interface CheckoutSession {
  href: string;
  checkoutSessionId: string;
  createdTime: string;
  expirationTime: string;
}

export interface CheckoutLineItem {
  name: string;
  price: number;
  unitQty: number;
  note?: string;
  taxRates?: { name: string; rate: number; taxRateUuid: string }[];
}

export interface CheckoutRedirectUrls {
  success: string;
  failure: string;
  cancel: string;
}

/** Hosted Checkout webhook body. `id` is the payment id, `data` the checkout session id. */
export interface CheckoutWebhookEvent {
  type: 'PAYMENT' | string;
  status: 'APPROVED' | 'DECLINED' | string;
  id: string;
  data: string;
  merchantId?: string;
  message?: string;
  createdTime?: number;
}

export interface EcommRefund {
  id: string;
  amount: number;
  charge: string;
  status: string;
}
