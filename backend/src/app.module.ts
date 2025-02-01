import { AuthGuard } from '@core/auth/auth.guard';
import { AuthMiddleware } from '@core/auth/auth.middleware';
import { CoreModule } from '@core/core.module';
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor';
import { TransformInterceptor } from '@core/interceptors/transform.interceptor';
import { SettingsModule } from '@core/settings/settings.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TemplateModule } from '@templates/template.module';
import { FeaturesModule } from './features/features.module';
import { MissionsModule } from './missions/missions.module';
import { PingController } from './ping/ping.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MissionsModule,
    SettingsModule,
    CoreModule,
    TemplateModule,
    FeaturesModule,
    UserModule,
    // CacheModule.register({
    //   ttl: 10000,
    //   max: 100,
    //   isGlobal: true,
    // }),
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
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: AppCacheInterceptor,
    // },
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
  // noinspection JSUnusedGlobalSymbols
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
