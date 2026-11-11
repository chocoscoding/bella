export type BrandId = 'italian' | 'mexican';

/** [open, close] as 24h "HH:MM" in the brand's time zone. */
export type DayHours = [open: string, close: string];

export interface Brand {
  id: BrandId;
  name: string;
  /** Clover item tag that marks this brand's menu; empty when the brand has its own merchant. */
  tag: string;
  siteUrl: string;
  phone: string;
  address: string;
  timeZone: string;
  /** Weekly hours, indexed Sunday = 0. */
  hours: DayHours[];
  prepMinutes: number;
  merchantId: string;
  restToken: string;
  ecommToken: string;
  /** Hosted Checkout webhook signing secret for this merchant. */
  webhookSecret: string;
  /** Clover categories whose names match are left off the online menu. */
  excludeCategories: RegExp;
  /** Items carrying any of these Clover tags are left off (e.g. alcohol). */
  excludeTags: string[];
}
