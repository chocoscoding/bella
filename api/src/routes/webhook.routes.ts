import express, { Router } from 'express';
import * as webhookController from '../controllers/webhook.controller.js';

/** Clover webhooks. Raw body so the signature can be verified: /api/webhooks/* */
export const webhookRoutes = Router();

webhookRoutes.post('/clover', express.raw({ type: '*/*', limit: '100kb' }), webhookController.cloverCheckout);
