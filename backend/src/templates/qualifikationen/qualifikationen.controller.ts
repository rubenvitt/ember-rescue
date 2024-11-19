import { Controller, Get } from '@nestjs/common';
import { QualifikationenRepository } from './qualifikationen.repository';
import { JSONSchemaType } from 'ajv';
import { QualifikationDto } from '@ember-rescue/shared';

@Controller('qualifikationen')
export class QualifikationenController {
  constructor(
    private readonly qualifikationenService: QualifikationenRepository,
  ) {}

  @Get()
  findAll() {
    return this.qualifikationenService.findActive();
  }

  @Get('/schema/v4')
  getSchema(): JSONSchemaType<Omit<QualifikationDto, '_id'>[]> {
    return {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          abkuerzung: { type: 'string' },
        },
        required: ['label', 'abkuerzung'],
      },
    };
  }
}
