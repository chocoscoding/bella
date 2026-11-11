import { body } from 'express-validator';
import { brandParam, optionalBrandQuery, refParam } from './common.validator.js';

export const listOrdersRules = [optionalBrandQuery];

export const orderRefRules = [refParam];

export const refundRules = [
  refParam,
  body('reason')
    .optional()
    .isIn(['requested_by_customer', 'duplicate', 'fraudulent'])
    .withMessage('reason must be requested_by_customer, duplicate or fraudulent.'),
];

export const merchantRules = [brandParam];
