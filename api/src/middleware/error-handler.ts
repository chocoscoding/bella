import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { AppError, CloverError } from '../utils/errors.js';
import { log } from '../utils/log.js';

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: 'Not found.' });
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    log.warn(`rejected ${req.method} ${req.originalUrl.split('?')[0]}`, { status: err.status, reason: err.message, item: err.details?.itemId as string | undefined });
    return void res.status(err.status).json({ error: err.message, ...err.details });
  }
  if ((err as { type?: string }).type === 'entity.parse.failed') return void res.status(400).json({ error: 'Invalid JSON.' });
  const id = randomUUID().slice(0, 8);
  if (err instanceof CloverError) log.error(`[error ${id}] ${req.method} ${req.path}: ${err.message}`, { clover: JSON.stringify(err.body)?.slice(0, 500) });
  else console.error(`ERROR [error ${id}] ${req.method} ${req.path}:`, err);
  // A Clover 4xx means our request was rejected upstream: report it as a bad gateway, not the guest's fault.
  const status = err instanceof CloverError && err.status < 500 ? 502 : 500;
  res.status(status).json({ error: 'Something went wrong on our side. Please try again or call us.', id });
}
