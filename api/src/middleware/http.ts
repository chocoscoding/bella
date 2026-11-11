import { timingSafeEqual } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { adminToken, allowedOrigins, getBrand } from '../config/index.js';

/** CORS for the two restaurant sites (and EXTRA_ORIGINS). */
export function cors(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  }
  if (req.method === 'OPTIONS') return void res.sendStatus(204);
  next();
}

/** Small fixed-window limiter per client IP. Use a shared store if you run several instances. */
export function rateLimit(max: number, windowMs: number) {
  const hits = new Map<string, { start: number; count: number }>();
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || now - entry.start > windowMs) hits.set(key, { start: now, count: 1 });
    else if (++entry.count > max) return void res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
    next();
  };
}

/** Attaches the brand config for /api/:brand routes. Runs after the brand param is validated. */
export function resolveBrand(req: Request, _res: Response, next: NextFunction) {
  req.brand = getBrand(String(req.params.brand));
  next();
}

/** Bearer ADMIN_TOKEN, compared in constant time. */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const given = Buffer.from(req.get('authorization')?.replace(/^Bearer /, '') || '');
  const expected = Buffer.from(adminToken);
  if (!adminToken || given.length !== expected.length || !timingSafeEqual(given, expected))
    return void res.status(401).json({ error: 'Unauthorized.' });
  next();
}
