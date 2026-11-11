import { body } from 'express-validator';
import { brandParam } from './common.validator.js';

const cartItems = [
  body('items')
    .isArray({ min: 1, max: 50 })
    .withMessage('Your bag is empty — or has more than 50 lines. Please call us for large orders.'),
  body('items.*.itemId').isString().trim().notEmpty().isLength({ max: 32 }).withMessage('An item in your bag is not valid.'),
  body('items.*.quantity').isInt({ min: 1, max: 25 }).withMessage('Choose between 1 and 25 of each item.').toInt(),
  body('items.*.modifierIds').optional().isArray({ max: 30 }).withMessage('Too many options on one item.'),
  body('items.*.modifierIds.*').isString().trim().notEmpty().isLength({ max: 32 }),
  body('items.*.note')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 140 })
    .withMessage('Keep special instructions under 140 characters.'),
];

const name = (field: string, label: string) =>
  body(`customer.${field}`)
    .isString()
    .withMessage(`Please add your ${label}.`)
    .trim()
    .notEmpty()
    .withMessage(`Please add your ${label}.`)
    .isLength({ max: 40 })
    .withMessage(`Your ${label} is too long.`)
    .customSanitizer((v: string) => v.replace(/\s+/g, ' '));

export const quoteRules = [brandParam, ...cartItems];

export const placeOrderRules = [
  brandParam,
  ...cartItems,
  name('firstName', 'first name'),
  name('lastName', 'last name'),
  body('customer.email')
    .isString()
    .trim()
    .isEmail()
    .withMessage('Please check your email address.')
    .isLength({ max: 120 })
    .customSanitizer((v: string) => v.toLowerCase()),
  body('customer.phone')
    .isString()
    .withMessage('Please add a phone number.')
    // US numbers: keep 10 digits, drop a leading country code 1.
    .customSanitizer((v: string) => v.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, ''))
    .isLength({ min: 10, max: 10 })
    .withMessage('Please add a 10-digit phone number so we can reach you about your order.'),
  body('pickup.asap').optional().isBoolean({ strict: true }).toBoolean(),
  body('pickup.at')
    .if((_value, { req }) => req.body?.pickup?.asap !== true)
    .isISO8601({ strict: true })
    .withMessage('Please choose a pickup time.'),
  body('note').optional().isString().trim().isLength({ max: 300 }).withMessage('Keep the kitchen note under 300 characters.'),
];
