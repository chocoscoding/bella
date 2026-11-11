import type { Request, Response } from 'express';
import { clover, orderingEnabled } from '../config/index.js';
import { getMenu } from '../services/menu.service.js';
import { pickupWindow } from '../services/hours.service.js';

export async function menu(req: Request, res: Response) {
  res.setHeader('Cache-Control', 'public, max-age=30');
  res.json(await getMenu(req.brand!));
}

export function storeInfo(req: Request, res: Response) {
  const b = req.brand!;
  res.setHeader('Cache-Control', 'no-store');
  res.json({
    id: b.id,
    name: b.name,
    phone: b.phone,
    address: b.address,
    sandbox: clover.sandbox,
    orderingEnabled,
    ...pickupWindow(b),
  });
}
