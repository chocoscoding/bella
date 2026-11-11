import { createHmac, timingSafeEqual } from 'node:crypto';

const TOLERANCE_SECONDS = 300;

/**
 * Verifies a Clover webhook `Clover-Signature: t=<unix>,v1=<hex>` header:
 * HMAC-SHA256 of "<t>.<raw body>" with the webhook signing secret.
 */
export function verifyCloverSignature(raw: string, header: string | undefined, secret: string, now = Date.now()): boolean {
  if (!secret || !header) return false;
  const parts = Object.fromEntries(header.split(',').map((p) => p.trim().split('=') as [string, string]));
  const t = Number(parts.t);
  if (!t || !parts.v1) return false;
  if (Math.abs(now / 1000 - t) > TOLERANCE_SECONDS) return false;
  const expected = Buffer.from(createHmac('sha256', secret).update(`${parts.t}.${raw}`).digest('hex'));
  const given = Buffer.from(parts.v1);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
