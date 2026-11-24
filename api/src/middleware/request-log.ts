import type { NextFunction, Request, Response } from 'express';
import { log } from '../utils/log.js';

/** One line per API request: method, path, status, time. Health checks are skipped. */
export function requestLog(req: Request, res: Response, next: NextFunction) {
  if (req.path === '/api/health') return next();
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Math.round(Number(process.hrtime.bigint() - start) / 1e6);
    const message = `${req.method} ${req.originalUrl.split('?')[0]} ${res.statusCode} ${ms}ms`;
    const fields = { origin: req.get('origin') };
    if (res.statusCode >= 500) log.error(message, fields);
    else if (res.statusCode >= 400) log.warn(message, fields);
    else log.info(message, fields);
  });
  next();
}
