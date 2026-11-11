import { matchedData } from 'express-validator';
import type { Request, Response } from 'express';
import { getBrand } from '../config/index.js';
import { orderStore } from '../services/store.service.js';
import { getEcommOrder } from '../services/payment.service.js';
import { getMerchant } from '../services/merchant.service.js';
import { refundOrder } from '../services/order.service.js';
import { AppError } from '../utils/errors.js';
import type { RefundBody } from '../types/order.js';

export async function listOrders(req: Request, res: Response) {
  const { brand } = matchedData<{ brand?: string }>(req, { locations: ['query'] });
  const orders = await orderStore.list();
  res.json(orders.filter((o) => !brand || o.brand === brand).slice(0, 200));
}

export async function cloverOrder(req: Request, res: Response) {
  const { ref } = matchedData<{ ref: string }>(req, { locations: ['params'] });
  const order = await orderStore.get(ref);
  if (!order?.payment?.cloverOrderId) throw new AppError(404, 'No paid Clover order for that reference.');
  res.json(await getEcommOrder(getBrand(order.brand), order.payment.cloverOrderId));
}

export async function refund(req: Request, res: Response) {
  const { ref, ...body } = matchedData<RefundBody & { ref: string }>(req, { locations: ['params', 'body'] });
  res.json(await refundOrder(ref, body));
}

export async function merchant(req: Request, res: Response) {
  res.json(await getMerchant(req.brand!));
}
