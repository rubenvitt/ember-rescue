import { Module } from '@nestjs/common';
import { EinsatzController } from './einsatz.controller';
import { EinsatzService } from './einsatz.service';
import { DatabaseModule } from '../database/database.module';
import { EinsatzEinheitenModule } from './einheiten/einsatz-einheiten.module';
import { EinsatztagebuchModule } from '../einsatztagebuch/einsatztagebuch.module';
import { EinheitenModule } from '../einheiten/einheiten.module';
import { AlarmstichwortModule } from '../alarmstichwort/alarmstichwort.module';

@Module({
  controllers: [EinsatzController],
  providers: [EinsatzService],
  imports: [
    AlarmstichwortModule,
    DatabaseModule,
    EinsatzEinheitenModule,
    EinsatztagebuchModule,
    EinheitenModule,
  ],
})
export class EinsatzModule {}
