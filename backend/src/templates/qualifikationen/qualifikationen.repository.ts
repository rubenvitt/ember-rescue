import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QualifikationTemplate } from '@templates/qualifikationen/qualifikation.schema';
import { Model } from 'mongoose';
import { BaseTemplateRepository } from '@templates/base-template.repository';

@Injectable()
export class QualifikationenRepository extends BaseTemplateRepository<QualifikationTemplate> {
  constructor(
    @InjectModel(QualifikationTemplate.name)
    readonly qualifikationModel: Model<QualifikationTemplate>,
  ) {
    super(qualifikationModel, QualifikationenRepository.name);
  }
}
