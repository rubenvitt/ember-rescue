import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { Error } from 'mongoose';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  errors?: string[];
  fields?: Array<{
    field: string;
    value: any;
    constraints: Record<string, string>;
  }>;
  details?: Array<{
    property: string;
    messages: string[];
  }>;
  stack?: string;
}

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    this.logger.debug('Exception caught:', { exception });
    this.logger.debug('Request:', {
      request: request.body,
      header: request.headers,
    });

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
    };

    if (exception instanceof UnprocessableEntityException) {
      const exceptionResponse = exception.getResponse() as Record<string, any>;

      if (exceptionResponse) {
        errorResponse.errors = exceptionResponse.errors;
        errorResponse.fields = exceptionResponse.fields;
        errorResponse.details = exceptionResponse.details;
      }
    }

    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = exception instanceof Error ? exception.stack : undefined;
    }

    this.logger.error('Error occurred:', {
      ...errorResponse,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(status).json(errorResponse);
  }

}
