import { Module } from '@nestjs/common';
import { FahrzeugeController } from './fahrzeuge.controller';
import { FahrzeugeService } from './fahrzeuge.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FahrzeugTemplate,
  FahrzeugTemplateSchema,
} from '@templates/vehicles/fahrzeug-template.schema';
import { FahrzeugeRepository } from '@templates/vehicles/fahrzeuge.repository';
import { OptaModule } from '@templates/opta/opta.module';

@Module({
  controllers: [FahrzeugeController],
  providers: [FahrzeugeService, FahrzeugeRepository],
  imports: [
    OptaModule,
    MongooseModule.forFeature([
      {
        name: FahrzeugTemplate.name,
        schema: FahrzeugTemplateSchema,
      },
    ]),
  ],
  exports: [FahrzeugeService, FahrzeugeRepository],
})
export class FahrzeugeModule {}
