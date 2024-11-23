import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SettingsModule } from '@core/settings/settings.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@core/auth/auth.guard';
import { AuthMiddleware } from '@core/auth/auth.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { CoreModule } from '@core/core.module';
import { TemplateModule } from '@templates/template.module';
import { FeaturesModule } from './features/features.module';
import { UserModule } from './user/user.module';
import { MissionsModule } from './missions/missions.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MissionsModule,
    SettingsModule,
    CoreModule,
    TemplateModule,
    FeaturesModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
