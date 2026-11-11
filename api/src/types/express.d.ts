import type { Brand } from './brand.js';

declare global {
  namespace Express {
    interface Request {
      /** Set by the resolveBrand middleware on /api/:brand routes. */
      brand?: Brand;
    }
  }
}

export {};
