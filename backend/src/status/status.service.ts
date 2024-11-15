import { Injectable } from '@nestjs/common';
import { JSONSchemaType } from 'ajv';
import { Status, StatusDto } from '../database/mongo/schemas/status.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class StatusService {
  constructor(
    @InjectModel(Status.name) private readonly statusModel: Model<Status>,
  ) {}

  findAll() {
    return this.statusModel.find().exec();
  }

  findStatusByCode(code: number) {
    return this.statusModel.findOne({ code }).exec();
  }

  findStatusById(id: string) {
    return this.statusModel.findById(id).exec();
  }

  getSchema(): JSONSchemaType<StatusDto[]> {
    return {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: { type: 'string', pattern: '^[0-9]$' },
          label: { type: 'string' },
          description: { type: 'string' },
        },
        required: ['code', 'label', 'description'],
      },
    };
  }
}
