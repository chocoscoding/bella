import type { Request, Response } from 'express';
import { clover } from '../config/index.js';

export function health(_req: Request, res: Response) {
  res.json({ ok: true, clover: clover.sandbox ? 'sandbox' : 'production' });
}
