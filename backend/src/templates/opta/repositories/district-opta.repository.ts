import { BaseTemplateRepository } from '@templates/base-template.repository';
import { DistrictOptaTemplate } from '@templates/opta/schemas/district-opta.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OptaType } from '@templates/opta/constants';

@Injectable()
export class DistrictOptaRepository extends BaseTemplateRepository<DistrictOptaTemplate> {
  constructor(
    @InjectModel(OptaType.DISTRICT) model: Model<DistrictOptaTemplate>,
  ) {
    super(model, DistrictOptaRepository.name);
  }
}
