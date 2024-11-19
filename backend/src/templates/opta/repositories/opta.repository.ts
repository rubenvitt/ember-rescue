import { BaseTemplateRepository } from '@templates/base-template.repository';
import { Opta } from '@templates/opta/schemas/opta.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OptaRepository extends BaseTemplateRepository<Opta> {
  constructor(@InjectModel(Opta.name) model: Model<Opta>) {
    super(model, OptaRepository.name);
  }
}
