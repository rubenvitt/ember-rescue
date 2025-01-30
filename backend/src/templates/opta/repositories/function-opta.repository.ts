import { TemplateRepository } from '@templates/template.repository';
import { FunctionOptaTemplate } from '@templates/opta/schemas/function-opta.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OptaType } from '@templates/opta/constants';

@Injectable()
export class FunctionOptaRepository extends TemplateRepository<FunctionOptaTemplate> {
  constructor(
    @InjectModel(OptaType.FUNCTION_CODE) model: Model<FunctionOptaTemplate>,
  ) {
    super(model, FunctionOptaRepository.name);
  }
}
