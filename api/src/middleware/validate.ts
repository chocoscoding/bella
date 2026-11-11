import { validationResult, type ValidationChain } from 'express-validator';
import type { NextFunction, Request, Response, RequestHandler } from 'express';

/**
 * Runs express-validator chains, then answers 422 with the first message
 * (shown to the guest) plus the full list for debugging.
 */
export function validate(rules: ValidationChain[]): RequestHandler[] {
  return [
    ...rules,
    (req: Request, res: Response, next: NextFunction) => {
      const result = validationResult(req);
      if (result.isEmpty()) return next();
      const errors = result.array({ onlyFirstError: true });
      res.status(422).json({
        error: errors[0]?.msg,
        errors: errors.map((e) => ({ field: e.type === 'field' ? e.path : e.type, message: e.msg })),
      });
    },
  ];
}
