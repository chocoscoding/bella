import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAdmin, resolveBrand } from '../middleware/http.js';
import { listOrdersRules, merchantRules, orderRefRules, refundRules } from '../validators/admin.validator.js';

/** Kitchen/support tools behind ADMIN_TOKEN: /api/admin/* */
export const adminRoutes = Router();

adminRoutes.use(requireAdmin);
adminRoutes.get('/orders', validate(listOrdersRules), adminController.listOrders);
adminRoutes.get('/orders/:ref/clover', validate(orderRefRules), adminController.cloverOrder);
adminRoutes.post('/orders/:ref/refund', validate(refundRules), adminController.refund);
adminRoutes.get('/:brand/merchant', validate(merchantRules), resolveBrand, adminController.merchant);
