import { Controller, Get, UseGuards } from '@nestjs/common';
import { QualifikationenRepository } from './qualifikationen.repository';
import { JSONSchemaType } from 'ajv';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';
import { ApiResponse } from '@nestjs/swagger';
import {
  ManyQualificationsResponse,
  QualificationDto,
} from '@templates/qualifications/qualifications.dto';

@Controller('templates/qualifications')
@UseGuards(BearbeiterGuard)
export class QualifikationenController {
  constructor(
    private readonly qualifikationenService: QualifikationenRepository,
  ) {}

  @Get()
  @ApiResponse({
    type: ManyQualificationsResponse,
    description: 'List of all qualifications',
  })
  findAll(): Promise<QualificationDto[]> {
    return this.qualifikationenService.findActive();
  }

  @Get('/schema/v4')
  getSchema(): JSONSchemaType<Omit<QualificationDto, '_id'>[]> {
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
