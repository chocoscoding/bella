import { matchedData } from 'express-validator';
import type { Request, Response } from 'express';
import { quoteCart, placeOrder, getOrderForGuest, toPublicOrder } from '../services/order.service.js';
import type { PlaceOrderBody, QuoteBody } from '../types/order.js';

export async function quote(req: Request, res: Response) {
  const { items } = matchedData<QuoteBody>(req, { locations: ['body'] });
  res.json(await quoteCart(req.brand!, items));
}

export async function create(req: Request, res: Response) {
  const body = matchedData<PlaceOrderBody>(req, { locations: ['body'] });
  const order = await placeOrder(req.brand!, body);
  res.status(201).json(toPublicOrder(order));
}

export async function show(req: Request, res: Response) {
  const { ref } = matchedData<{ ref: string }>(req, { locations: ['params'] });
  res.setHeader('Cache-Control', 'no-store');
  res.json(await getOrderForGuest(ref));
}
