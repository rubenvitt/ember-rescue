import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  code: string;
  message: string;
  details?: Record<string, any>;
}

@Catch()
export class ExceptionsFilter<T extends Error> implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);

  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    if (exception instanceof HttpException) {
      this.logger.debug('HTTPException: will do nothing');
      response.status(exception.getStatus()).json(exception.getResponse());
    }

    let errorResponse: ErrorResponse;
    const f = false;
    if (f) {
      errorResponse = {
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: request.url,
        code: 'INTERNAL_SERVER_ERROR',
        message: exception.message,
      };
    } else {
      errorResponse = {
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: request.url,
        code: 'INTERNAL_SERVER_ERROR',
        message: exception.message,
      };
    }

    this.logError(exception, errorResponse);

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private logError(error: Error, errorResponse: ErrorResponse) {
    this.logger.error('Error occurred:', {
      error: error,
      response: errorResponse,
    });
  }
}
