import { BaseTemplateRepository } from '@templates/base-template.repository';
import { BosOptaTemplate } from '@templates/opta/schemas/bos-opta.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { BosGroup, OptaType } from '@templates/opta/constants';
import { isCurrentlyActiveFilter } from '@templates/core/interfaces/template.interface';

@Injectable()
export class BosOptaRepository extends BaseTemplateRepository<BosOptaTemplate> {
  constructor(@InjectModel(OptaType.BOS_CODE) model: Model<BosOptaTemplate>) {
    super(model, BosOptaRepository.name);
  }

  async findByGroup(group: BosGroup): Promise<BosOptaTemplate[]> {
    return this.model.find({ group, ...isCurrentlyActiveFilter }).exec();
  }

  async findByRufname(rufname: string) {
    return this.model.find({ rufname, ...isCurrentlyActiveFilter }).exec();
  }
}
