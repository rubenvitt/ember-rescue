import {
  ExecutionContext,
  Injectable,
  Logger,
  SetMetadata,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Injectable()
export class AppCacheInterceptor extends CacheInterceptor {
  private static readonly logger = new Logger(AppCacheInterceptor.name);

  trackBy(context: ExecutionContext): string | undefined {
    const isSkipCache = this.reflector.get<boolean>(
      'skipCache',
      context.getHandler(),
    );
    if (isSkipCache) {
      let url = context.switchToHttp().getRequest().url;
      if (!url.includes('ping'))
        AppCacheInterceptor.logger.verbose(`Skip cache for ${url}`);
      return undefined;
    }
    AppCacheInterceptor.logger.verbose(
      `${context.switchToHttp().getRequest().url} may be cached`,
    );
    return super.trackBy(context);
  }
}

export const SkipCache = () => SetMetadata('skipCache', true);
