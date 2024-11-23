import { Module } from '@nestjs/common';
import { FahrzeugeController } from './fahrzeuge.controller';
import { FahrzeugeService } from './fahrzeuge.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FahrzeugTemplate,
  FahrzeugTemplateSchema,
} from '@templates/vehicles/fahrzeug-template.schema';
import { FahrzeugeRepository } from '@templates/vehicles/fahrzeuge.repository';

@Module({
  controllers: [FahrzeugeController],
  providers: [FahrzeugeService, FahrzeugeRepository],
  imports: [
    MongooseModule.forFeature([
      {
        name: FahrzeugTemplate.name,
        schema: FahrzeugTemplateSchema,
      },
    ]),
  ],
  exports: [FahrzeugeService],
})
export class FahrzeugeModule {}
