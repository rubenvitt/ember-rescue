import { Module } from '@nestjs/common';
import { EinsatzController } from './einsatz.controller';
import { EinsatzService } from './einsatz.service';
import { DatabaseModule } from '../database/database.module';
import { EinsatztagebuchModule } from '../einsatztagebuch/einsatztagebuch.module';
import { AlarmstichwortModule } from '../alarmstichwort/alarmstichwort.module';
import { EinsatzFahrzeugeModule } from './fahrzeuge/einsatz-fahrzeuge.module';
import { FahrzeugeModule } from '../fahrzeuge/fahrzeuge.module';

@Module({
  controllers: [EinsatzController],
  providers: [EinsatzService],
  exports: [EinsatzService],
  imports: [
    AlarmstichwortModule,
    DatabaseModule,
    EinsatzFahrzeugeModule,
    EinsatztagebuchModule,
    FahrzeugeModule,
  ],
})
export class EinsatzModule {}
