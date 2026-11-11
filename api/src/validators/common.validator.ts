import { param, query } from 'express-validator';
import { brandIds } from '../config/index.js';
import { REF_PATTERN } from '../services/store.service.js';

export const brandParam = param('brand').isIn(brandIds).withMessage('Unknown restaurant.');

export const refParam = param('ref')
  .trim()
  .toUpperCase()
  .matches(REF_PATTERN)
  .withMessage('That order reference doesn’t look right.');

export const optionalBrandQuery = query('brand').optional().isIn(brandIds).withMessage('Unknown restaurant.');
