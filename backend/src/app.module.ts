import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SettingsModule } from '@core/settings/settings.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from '@core/auth/auth.guard';
import { AuthMiddleware } from '@core/auth/auth.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { CoreModule } from '@core/core.module';
import { TemplateModule } from '@templates/template.module';
import { FeaturesModule } from './features/features.module';
import { UserModule } from './user/user.module';
import { MissionsModule } from './missions/missions.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { TransformInterceptor } from '@core/interceptors/transform.interceptor';
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor';
import { PingController } from './ping/ping.controller';
import { AppCacheInterceptor } from '@core/interceptors/cache.interceptor';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MissionsModule,
    SettingsModule,
    CoreModule,
    TemplateModule,
    FeaturesModule,
    UserModule,
    CacheModule.register({
      ttl: 10000,
      max: 100,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 600,
        limit: 10,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AppCacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [PingController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
