import { TemplateRepository } from '@templates/template.repository';
import { VehiclesTemplate } from '@templates/vehicles/vehicles-template.schema';
import { Injectable } from '@nestjs/common';
import { AnyKeys, FilterQuery, Model, QueryOptions } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUpdateFahrzeugDto } from '@templates/vehicles/fahrzeuge.dto';

@Injectable()
export class VehiclesRepository extends TemplateRepository<VehiclesTemplate> {
  constructor(
    @InjectModel(VehiclesTemplate.name) model: Model<VehiclesTemplate>,
  ) {
    super(model, VehiclesRepository.name);
  }

  // TODO: refactor this
  upsertMany(fahrzeuge: CreateUpdateFahrzeugDto[]) {
    const operations = fahrzeuge.map(async ({ _id, ...fahrzeug }) => {
      this.logger.debug(`upserting vehicle ${_id || 'new'}`);

      const updateData = {
        ...fahrzeug,
        opta: {
          ...fahrzeug.opta,
        },
      };

      this.logger.debug(updateData);

      if (_id) {
        const doc = await this.model.findById(_id);
        if (doc) {
          Object.assign(doc, updateData);
          return doc.save();
        }
      } else {
        return this.model.create(updateData);
      }
    });

    return Promise.all(operations);
  }

  findActiveWithOpta(
    filterQuery: FilterQuery<VehiclesTemplate> = {},
    projection: AnyKeys<VehiclesTemplate> = {},
    options: QueryOptions = {},
  ) {
    return this.model.find(filterQuery, projection, options).populate('opta');
  }
}
