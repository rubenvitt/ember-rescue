import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QualifikationTemplate } from '@templates/qualifications/qualifikation.schema';
import { Model } from 'mongoose';
import { TemplateRepository } from '@templates/template.repository';

@Injectable()
export class QualifikationenRepository extends TemplateRepository<QualifikationTemplate> {
  constructor(
    @InjectModel(QualifikationTemplate.name)
    readonly qualifikationModel: Model<QualifikationTemplate>,
  ) {
    super(qualifikationModel, QualifikationenRepository.name);
  }
}
