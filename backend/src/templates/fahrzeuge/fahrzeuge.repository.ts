import { TemplateRepository } from '@templates/template.repository';
import { FahrzeugTemplate } from '@templates/fahrzeuge/fahrzeug-template.schema';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateCreateFahrzeugeDto } from '../../types';

@Injectable()
export class FahrzeugeRepository extends TemplateRepository<FahrzeugTemplate> {
  constructor(
    @InjectModel(FahrzeugTemplate.name) model: Model<FahrzeugTemplate>,
  ) {
    super(model, FahrzeugeRepository.name);
  }

  // TODO: refactor this
  upsertMany(fahrzeuge: UpdateCreateFahrzeugeDto) {
    return Promise.all(
      fahrzeuge.map(async ({ _id, opta, ...fahrzeug }) => {
        return this.model.findByIdAndUpdate(
          _id,
          {
            fullOpta: `${opta.district} ${opta.bosCode} ${opta.ort} ${opta.localCode}-${opta.functionCode}-${opta.orderNumber}`,
            ...fahrzeug,
          },
          {
            upsert: true,
            new: true,
          },
        );
      }),
    );
  }
}
