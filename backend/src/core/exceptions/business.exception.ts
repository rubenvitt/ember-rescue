import { BaseException } from '@core/exceptions/base.exception';

export class BusinessException extends BaseException {
  constructor(message: string, code: string, details?: Record<string, any>) {
    super(message, code, 400, details);
  }
}
