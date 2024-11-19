import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BearbeiterModule } from './bearbeiter/bearbeiter.module';
import { EinsatztagebuchModule } from './einsatztagebuch/einsatztagebuch.module';
import { FahrzeugeModule } from './fahrzeuge/fahrzeuge.module';
import { StatusModule } from './status/status.module';
import { EinsatzModule } from './einsatz/einsatz.module';
import { SecretsModule } from './secrets/secrets.module';
import { SettingsModule } from './settings/settings.module';
import { MetaModule } from './meta/meta.module';
import { NinaModule } from './apis/bund/nina/nina.module';
import { MapModule } from './map/map.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@core/auth/auth.guard';
import { AuthMiddleware } from '@core/auth/auth.middleware';
import { ExportModule } from './export/export.module';
import { PdfModule } from './pdf/pdf.module';
import { NotizenModule } from './notizen/notizen.module';
import { RemindersModule } from './reminders/reminders.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CoreModule } from '@core/core.module';
import { BaseTemplateModule } from '@templates/base-template.module';

@Module({
  imports: [
    BearbeiterModule,
    ScheduleModule.forRoot(),
    EinsatztagebuchModule,
    FahrzeugeModule,
    StatusModule,
    EinsatzModule,
    SecretsModule,
    SettingsModule,
    MetaModule,
    NinaModule,
    MapModule,
    ExportModule,
    PdfModule,
    NotizenModule,
    RemindersModule,
    CoreModule,
    BaseTemplateModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
