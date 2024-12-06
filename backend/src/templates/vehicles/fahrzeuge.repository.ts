import { TemplateRepository } from '@templates/template.repository';
import { FahrzeugTemplate } from '@templates/vehicles/fahrzeug-template.schema';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ImportFahrzeugDto } from '@templates/vehicles/fahrzeuge.dto';

@Injectable()
export class FahrzeugeRepository extends TemplateRepository<FahrzeugTemplate> {
  constructor(
    @InjectModel(FahrzeugTemplate.name) model: Model<FahrzeugTemplate>,
  ) {
    super(model, FahrzeugeRepository.name);
  }

  // TODO: refactor this
  upsertMany(fahrzeuge: ImportFahrzeugDto[]) {
    return Promise.all(
      fahrzeuge.map(async ({ _id, ...fahrzeug }) => {
        return this.model.findByIdAndUpdate(_id, fahrzeug, {
          upsert: true,
          new: true,
        });
      }),
    );
  }
}
