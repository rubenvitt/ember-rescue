import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { generateFullOpta } from '@templates/opta/utils/opta.utils';
import { TemplateRepository } from '@templates/template.repository';
import { CreateUpdateFahrzeugDto } from '@templates/vehicles/fahrzeuge.dto';
import { VehiclesTemplate } from '@templates/vehicles/vehicles-template.schema';
import { AnyKeys, FilterQuery, Model, QueryOptions } from 'mongoose';

@Injectable()
export class VehiclesRepository extends TemplateRepository<VehiclesTemplate> {
  constructor(
    @InjectModel(VehiclesTemplate.name) model: Model<VehiclesTemplate>,
  ) {
    super(model, VehiclesRepository.name);
  }

  upsertMany(fahrzeuge: CreateUpdateFahrzeugDto[]) {
    const operations = fahrzeuge.map(async ({ _id, ...fahrzeug }) => {
      this.logger.debug(`upserting vehicle ${_id ?? JSON.stringify(fahrzeug.opta)}`);

      // Generate fullOpta
      const fullOpta = generateFullOpta({
        district: fahrzeug.opta.district,
        bosCode: fahrzeug.opta.bosCode,
        ort: fahrzeug.opta.ort,
        localCode: fahrzeug.opta.localCode,
        functionCode: fahrzeug.opta.functionCode,
        orderNumber: fahrzeug.opta.orderNumber,
        fullOpta: fahrzeug.opta.fullOpta,
      });

      const updateData = {
        ...fahrzeug,
        opta: {
          ...fahrzeug.opta,
          fullOpta,
        },
        fullOpta
      };

      // Find by fullOpta
      const existingDoc = await this.model.findById(_id);

      this.logger.debug(`existingDoc: ${JSON.stringify(existingDoc)}`);

      if (existingDoc) {
        Object.assign(existingDoc, updateData);
        return existingDoc.save();
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
    return this.model.find(filterQuery, projection, options).exec();
  }
}
