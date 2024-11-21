import { Module } from '@nestjs/common';
import { EinsatzCoreController } from './einsatz-core.controller';
import { EinsatzCoreService } from './einsatz-core.service';
import { FahrzeugeModule } from '@templates/fahrzeuge/fahrzeuge.module';
import { BearbeiterModule } from '../../bearbeiter/bearbeiter.module';
import { BaseTemplateModule } from '@templates/base-template.module';
import { EinsatzSchemaModule } from '../schema/einsatz-schema.module';
import { EinsatztagebuchModule } from '../einsatztagebuch/einsatztagebuch.module';

@Module({
  controllers: [EinsatzCoreController],
  providers: [EinsatzCoreService],
  exports: [EinsatzCoreService],
  imports: [
    BearbeiterModule,
    EinsatzSchemaModule,
    EinsatztagebuchModule,
    FahrzeugeModule,
    BaseTemplateModule,
  ],
})
export class EinsatzCoreModule {}
