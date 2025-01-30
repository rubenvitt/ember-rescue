import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isCurrentlyActiveFilter } from '@templates/core/interfaces/template.interface';
import { Status } from '@templates/status/status.schema';
import { TemplateRepository } from '@templates/template.repository';
import { Model } from 'mongoose';

@Injectable()
export class StatusRepository extends TemplateRepository<Status> {
  constructor(@InjectModel(Status.name) readonly model: Model<Status>) {
    super(model, StatusRepository.name);
  }

  private validateStatusCode(code: number): number {
    if (typeof code !== 'number' || isNaN(code)) {
      throw new BadRequestException('Status code must be a valid number');
    }
    if (code < 0 || code > 9) {
      throw new BadRequestException('Status code must be between 0 and 9');
    }
    return code;
  }

  async findActiveByCode(code: number) {
    return this.model.findOne({
      code: this.validateStatusCode(code),
      ...isCurrentlyActiveFilter,
    }).exec();
  }
}
