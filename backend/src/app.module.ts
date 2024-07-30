import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { BearbeiterModule } from './bearbeiter/bearbeiter.module';
import { ConfigModule } from '@nestjs/config';
import { EinsatztagebuchModule } from './einsatztagebuch/einsatztagebuch.module';
import { QualifikationenModule } from './qualifikationen/qualifikationen.module';
import { EinheitenModule } from './einheiten/einheiten.module';
import { StatusModule } from './status/status.module';
import { EinsatzModule } from './einsatz/einsatz.module';
import * as Joi from 'joi';
import { AlarmstichwortModule } from './alarmstichwort/alarmstichwort.module';
import { SecretsModule } from './secrets/secrets.module';
import { SettingsModule } from './settings/settings.module';
import { MetaModule } from './meta/meta.module';
import { NinaModule } from './apis/bund/nina/nina.module';
import { MapModule } from './map/map.module';

@Module({
  imports: [
    DatabaseModule,
    BearbeiterModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
      }),
      envFilePath: ['.env.development.local', '.dev.env', '.env'],
      isGlobal: true,
    }),
    EinsatztagebuchModule,
    QualifikationenModule,
    EinheitenModule,
    StatusModule,
    EinsatzModule,
    AlarmstichwortModule,
    SecretsModule,
    SettingsModule,
    MetaModule,
    NinaModule,
    MapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
