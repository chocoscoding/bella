import { Router } from 'express';
import * as menuController from '../controllers/menu.controller.js';
import * as orderController from '../controllers/order.controller.js';
import { validate } from '../middleware/validate.js';
import { rateLimit, resolveBrand } from '../middleware/http.js';
import { brandParam } from '../validators/common.validator.js';
import { placeOrderRules, quoteRules } from '../validators/order.validator.js';

/** Storefront routes for one restaurant: /api/:brand/* */
export const brandRoutes = Router({ mergeParams: true });

brandRoutes.get('/menu', validate([brandParam]), resolveBrand, menuController.menu);
brandRoutes.get('/info', validate([brandParam]), resolveBrand, menuController.storeInfo);
brandRoutes.post('/quote', rateLimit(60, 60_000), validate(quoteRules), resolveBrand, orderController.quote);
brandRoutes.post('/orders', rateLimit(8, 60_000), validate(placeOrderRules), resolveBrand, orderController.create);
