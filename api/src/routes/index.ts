import { Router } from 'express';
import { health } from '../controllers/health.controller.js';
import { adminRoutes } from './admin.routes.js';
import { brandRoutes } from './brand.routes.js';
import { orderRoutes } from './order.routes.js';
import { webhookRoutes } from './webhook.routes.js';

export const apiRoutes = Router();

apiRoutes.get('/health', health);
apiRoutes.use('/orders', orderRoutes);
apiRoutes.use('/webhooks', webhookRoutes);
apiRoutes.use('/admin', adminRoutes);
// Last: /:brand would otherwise shadow the fixed prefixes above.
apiRoutes.use('/:brand', brandRoutes);
