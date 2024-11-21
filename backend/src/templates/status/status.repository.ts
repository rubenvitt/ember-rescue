import { TemplateRepository } from '@templates/template.repository';
import { Status } from '@templates/status/status.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { isCurrentlyActiveFilter } from '@templates/core/interfaces/template.interface';

@Injectable()
export class StatusRepository extends TemplateRepository<Status> {
  constructor(@InjectModel(Status.name) readonly model: Model<Status>) {
    super(model, StatusRepository.name);
  }

  findActiveByCode(code: number) {
    return this.model.findOne({
      code,
      ...isCurrentlyActiveFilter,
    });
  }
}
