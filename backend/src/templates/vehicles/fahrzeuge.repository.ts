import { TemplateRepository } from '@templates/template.repository';
import { FahrzeugTemplate } from '@templates/vehicles/fahrzeug-template.schema';
import { Injectable } from '@nestjs/common';
import { AnyKeys, FilterQuery, Model, QueryOptions } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUpdateFahrzeugDto } from '@templates/vehicles/fahrzeuge.dto';

@Injectable()
export class FahrzeugeRepository extends TemplateRepository<FahrzeugTemplate> {
  constructor(
    @InjectModel(FahrzeugTemplate.name) model: Model<FahrzeugTemplate>,
  ) {
    super(model, FahrzeugeRepository.name);
  }

  // TODO: refactor this
  upsertMany(fahrzeuge: CreateUpdateFahrzeugDto[]) {
    return Promise.all(
      fahrzeuge.map(async ({ _id, ...fahrzeug }) => {
        return this.model.findByIdAndUpdate(_id, fahrzeug, {
          upsert: true,
          new: true,
        });
      }),
    );
  }

  findActiveWithOpta(
    filterQuery: FilterQuery<FahrzeugTemplate> = {},
    projection: AnyKeys<FahrzeugTemplate> = {},
    options: QueryOptions = {},
  ) {
    return this.model.find(filterQuery, projection, options).populate('opta');
  }
}
