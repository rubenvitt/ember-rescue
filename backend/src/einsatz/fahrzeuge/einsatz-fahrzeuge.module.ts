import { Module } from '@nestjs/common';
import { EinsatzFahrzeugeController } from './einsatz-fahrzeuge.controller';
import { EinsatzFahrzeugeService } from './einsatz-fahrzeuge.service';
import { DatabaseModule } from '../../database/database.module';
import { EinsatztagebuchModule } from '../../einsatztagebuch/einsatztagebuch.module';
import { StatusModule } from '../../status/status.module';
import { FahrzeugeModule } from '../../fahrzeuge/fahrzeuge.module';

@Module({
  controllers: [EinsatzFahrzeugeController],
  providers: [EinsatzFahrzeugeService],
  imports: [
    DatabaseModule,
    FahrzeugeModule,
    EinsatztagebuchModule,
    StatusModule,
  ],
})
export class EinsatzFahrzeugeModule {}
