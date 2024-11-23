import { ApiResponse } from '@ember-rescue/shared/src/dto/common';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> | Promise<Observable<ApiResponse<T>>> {
    return next.handle().pipe(
      map((data) => ({
        data: data?.['data'] ?? data,
        meta: {
          timestamp: new Date().toISOString(),
          ...(data?.['meta']?.['pagination'] && {
            pagination: data['meta'].pagination,
          }),
        },
      })),
    );
  }
}
