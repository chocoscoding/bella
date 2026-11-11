import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { validate } from '../middleware/validate.js';
import { rateLimit } from '../middleware/http.js';
import { refParam } from '../validators/common.validator.js';

/** Order status for the guest, polled by the status page: /api/orders/:ref */
export const orderRoutes = Router();

orderRoutes.get('/:ref', rateLimit(120, 60_000), validate([refParam]), orderController.show);
