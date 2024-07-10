import { Module } from '@nestjs/common';
import { EinsatzEinheitenController } from './einsatz-einheiten.controller';
import { EinsatzEinheitenService } from './einsatz-einheiten.service';
import { DatabaseModule } from '../../database/database.module';
import { EinsatztagebuchModule } from '../../einsatztagebuch/einsatztagebuch.module';
import { EinheitenModule } from '../../einheiten/einheiten.module';

@Module({
  controllers: [EinsatzEinheitenController],
  providers: [EinsatzEinheitenService],
  imports: [DatabaseModule, EinheitenModule, EinsatztagebuchModule],
})
export class EinsatzEinheitenModule {}
