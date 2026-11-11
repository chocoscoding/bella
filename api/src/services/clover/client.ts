import { clover } from '../../config/index.js';
import { CloverError } from '../../utils/errors.js';
import type { Brand } from '../../types/brand.js';
import type { CloverList } from '../../types/clover.js';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface FetchOptions {
  token: string;
  method?: Method;
  body?: unknown;
  headers?: Record<string, string>;
  retries?: number;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** fetch() for Clover APIs with JSON handling and retry on 429/5xx. */
export async function cloverFetch<T>(url: string, { token, method = 'GET', body, headers = {}, retries = 2 }: FetchOptions): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(20_000),
    });
    const text = await res.text();
    let data: unknown;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (res.ok) return data as T;
    if ((res.status === 429 || res.status >= 500) && attempt < retries) {
      await sleep(Number(res.headers.get('retry-after')) * 1000 || 400 * 2 ** attempt);
      continue;
    }
    const message = (data as { message?: string } | null)?.message || res.statusText;
    throw new CloverError(`Clover ${method} ${new URL(url).pathname} failed (${res.status}): ${message}`, res.status, data);
  }
}

/** Client for the v3 REST API (customers, inventory, merchant, orders, payments). */
export function rest(brand: Brand) {
  const base = `${clover.restBase}/v3/merchants/${brand.merchantId}`;
  const call =
    (method: Method) =>
    <T>(path: string, body?: unknown) =>
      cloverFetch<T>(base + path, { token: brand.restToken, method, body });
  return {
    get: call('GET'),
    post: call('POST'),
    delete: call('DELETE'),
    /** Follows offset pagination and returns every element. */
    async all<T>(path: string, pageSize = 500): Promise<T[]> {
      const out: T[] = [];
      for (let offset = 0; ; offset += pageSize) {
        const sep = path.includes('?') ? '&' : '?';
        const page = await cloverFetch<CloverList<T>>(`${base}${path}${sep}limit=${pageSize}&offset=${offset}`, { token: brand.restToken });
        const elements = page.elements || [];
        out.push(...elements);
        if (elements.length < pageSize) return out;
      }
    },
  };
}

/** Client for the Ecommerce API (orders, charges, refunds) with the ecommerce private token. */
export function ecomm(brand: Brand) {
  const call =
    (method: Method) =>
    <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
      cloverFetch<T>(clover.ecommBase + path, { token: brand.ecommToken, method, body, headers });
  return { get: call('GET'), post: call('POST') };
}

/** Client for Hosted Checkout (ecommerce private token + merchant header). */
export function hostedCheckout(brand: Brand) {
  return <T>(path: string, body: unknown) =>
    cloverFetch<T>(`${clover.checkoutBase}/invoicingcheckoutservice/v1${path}`, {
      token: brand.ecommToken,
      method: 'POST',
      headers: { 'X-Clover-Merchant-Id': brand.merchantId },
      body,
    });
}
