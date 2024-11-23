import { Module } from '@nestjs/common';
import { EinsatzFahrzeugeController } from './einsatz-fahrzeuge.controller';
import { EinsatzFahrzeugeService } from './einsatz-fahrzeuge.service';
import { EinsatztagebuchModule } from '../journal/einsatztagebuch.module';
import { StatusModule } from '@templates/status/status.module';
import { FahrzeugeModule } from '@templates/vehicles/fahrzeuge.module';
import { EinsatzSchemaModule } from '../schema/einsatz-schema.module';

@Module({
  controllers: [EinsatzFahrzeugeController],
  providers: [EinsatzFahrzeugeService],
  imports: [
    EinsatzSchemaModule,
    FahrzeugeModule,
    EinsatztagebuchModule,
    StatusModule,
  ],
})
export class EinsatzFahrzeugeModule {}
