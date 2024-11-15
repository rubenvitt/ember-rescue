import { Controller, Get } from '@nestjs/common';
import { QualifikationenService } from './qualifikationen.service';
import { QualifikationDto } from '../types';
import { JSONSchemaType } from 'ajv';

@Controller('qualifikationen')
export class QualifikationenController {
  constructor(
    private readonly qualifikationenService: QualifikationenService,
  ) {}

  @Get()
  findAll() {
    return this.qualifikationenService.findAll();
  }

  @Get('/schema/v3')
  getSchema(): JSONSchemaType<Omit<QualifikationDto, '_id'>[]> {
    return {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          bezeichnung: { type: 'string' },
          abkuerzung: { type: 'string' },
        },
        required: ['bezeichnung', 'abkuerzung'],
      },
    };
  }
}
