import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Error } from 'mongoose';

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
      return;
    }

    let errorResponse: ErrorResponse;
    const f = false;
    if (f) {
      errorResponse = {
        statusCode: HttpStatus.I_AM_A_TEAPOT,
        timestamp: new Date().toISOString(),
        path: request.url,
        code: 'INTERNAL_SERVER_ERROR',
        message: exception.message,
      };
    }
    if (exception instanceof Error.CastError) {
      errorResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
        path: request.url,
        code: 'BAD_REQUEST',
        message: exception.message, // TODO: is this safe? - maybe I should add 'detailed exception massages' ENV for development
      };
    } else {
      errorResponse = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        path: request.url,
        code: 'INTERNAL_SERVER_ERROR',
        message:
          '🚨 Oops! Something went wrong. Server is broken here. Call 🚑',
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
