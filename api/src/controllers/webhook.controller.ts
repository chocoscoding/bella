import type { Request, Response } from 'express';
import { brands } from '../config/index.js';
import { verifyCloverSignature } from '../services/webhook.service.js';
import { handleCheckoutEvent } from '../services/order.service.js';
import type { CheckoutWebhookEvent } from '../types/clover.js';

/**
 * Clover Hosted Checkout payment events. Each restaurant's merchant signs with
 * its own secret, so the signature must match one of the brands' secrets.
 * The body arrives raw so the signature can be checked.
 */
export async function cloverCheckout(req: Request, res: Response) {
  const secrets = Object.values(brands).map((b) => b.webhookSecret).filter(Boolean);
  if (!secrets.length) return void res.status(503).json({ error: 'Webhook secret not configured.' });
  const raw = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : '';
  const signature = req.get('clover-signature');
  if (!secrets.some((secret) => verifyCloverSignature(raw, signature, secret)))
    return void res.status(401).json({ error: 'Bad signature.' });
  let event: CheckoutWebhookEvent;
  try {
    event = JSON.parse(raw);
  } catch {
    return void res.status(400).json({ error: 'Invalid JSON.' });
  }
  const handled = await handleCheckoutEvent(event);
  res.json({ ok: true, handled });
}
