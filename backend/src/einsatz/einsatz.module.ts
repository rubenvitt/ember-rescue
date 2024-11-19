import { Module } from '@nestjs/common';
import { EinsatzController } from './einsatz.controller';
import { EinsatzService } from './einsatz.service';
import { DatabaseModule } from '@core/database/database.module';
import { EinsatztagebuchModule } from '../einsatztagebuch/einsatztagebuch.module';
import { EinsatzFahrzeugeModule } from './fahrzeuge/einsatz-fahrzeuge.module';
import { FahrzeugeModule } from '@templates/fahrzeuge/fahrzeuge.module';
import { BearbeiterModule } from '../bearbeiter/bearbeiter.module';
import { BaseTemplateModule } from '@templates/base-template.module';

@Module({
  controllers: [EinsatzController],
  providers: [EinsatzService],
  exports: [EinsatzService],
  imports: [
    BearbeiterModule,
    DatabaseModule,
    EinsatzFahrzeugeModule,
    EinsatztagebuchModule,
    FahrzeugeModule,
    BaseTemplateModule,
  ],
})
export class EinsatzModule {}
