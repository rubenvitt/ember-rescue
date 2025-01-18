import { BaseException } from '@core/exceptions/base.exception';

export class ValidationException extends BaseException {
  constructor(...errors: Record<string, string>[]) {
    super('Validation failed', 'VALIDATION_ERROR', 400, {
      validationErrors: errors,
    });
  }
}
