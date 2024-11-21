import { Module } from '@nestjs/common';
import { EinsatzCoreController } from './einsatz-core.controller';
import { EinsatzCoreService } from './einsatz-core.service';
import { FahrzeugeModule } from '@templates/fahrzeuge/fahrzeuge.module';
import { TemplateModule } from '@templates/template.module';
import { EinsatzSchemaModule } from '../schema/einsatz-schema.module';
import { EinsatztagebuchModule } from '../einsatztagebuch/einsatztagebuch.module';
import { UserModule } from '../../user/user.module';

@Module({
  controllers: [EinsatzCoreController],
  providers: [EinsatzCoreService],
  exports: [EinsatzCoreService],
  imports: [
    UserModule,
    EinsatzSchemaModule,
    EinsatztagebuchModule,
    FahrzeugeModule,
    TemplateModule,
  ],
})
export class EinsatzCoreModule {}
