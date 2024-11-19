import { BaseTemplateRepository } from '@templates/base-template.repository';
import { LocalCodeOptaTemplate } from '@templates/opta/schemas/local-code-opta.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OptaType } from '@templates/opta/constants';

@Injectable()
export class LocalCodeOptaRepository extends BaseTemplateRepository<LocalCodeOptaTemplate> {
  constructor(
    @InjectModel(OptaType.LOCAL_CODE)
    model: Model<LocalCodeOptaTemplate>,
  ) {
    super(model, LocalCodeOptaRepository.name);
  }
}
