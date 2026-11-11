import express from 'express';
import { apiRoutes } from './routes/index.js';
import { cors } from './middleware/http.js';
import { errorHandler, notFound } from './middleware/error-handler.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(cors);
  // Webhooks parse their own raw body; everything else is JSON.
  app.use(/^(?!\/api\/webhooks)/, express.json({ limit: '50kb' }));
  app.use('/api', apiRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
