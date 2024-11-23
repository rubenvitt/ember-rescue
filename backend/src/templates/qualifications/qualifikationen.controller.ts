import { Controller, Get, UseGuards } from '@nestjs/common';
import { QualifikationenRepository } from './qualifikationen.repository';
import { JSONSchemaType } from 'ajv';
import { QualifikationDto } from '@ember-rescue/shared';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';

@Controller('templates/qualifications')
@UseGuards(BearbeiterGuard)
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
