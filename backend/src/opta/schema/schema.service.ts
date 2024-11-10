import { Injectable } from '@nestjs/common';
import { JSONSchemaType } from 'ajv';
import {
  BosOptaEntryDto,
  DistrictEntryDto,
  FunctionOptaEntryDto,
  LocalCodeEntryDto,
} from '../../database/mongo/schemas/opta/entry.schema';

@Injectable()
export class SchemaService {
  generateSchemaFunktionen(): JSONSchemaType<FunctionOptaEntryDto[]> {
    return {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          description: { type: 'string', nullable: true },
          label: { type: 'string' },
          validFrom: { type: 'string', format: 'date-time', nullable: true },
          validUntil: { type: 'string', format: 'date-time', nullable: true },
          group: { type: 'string' },
          type: { type: 'string', enum: ['FUNCTION_CODE'] },
        },
        required: ['code', 'label', 'group', 'type'],
      },
    } as unknown as JSONSchemaType<FunctionOptaEntryDto[]>;
  }

  generateSchemaBos(): JSONSchemaType<BosOptaEntryDto[]> {
    return {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          description: { type: 'string', nullable: true },
          label: { type: 'string' },
          rufname: { type: 'string' },
          validFrom: { type: 'string', format: 'date-time', nullable: true },
          validUntil: { type: 'string', format: 'date-time', nullable: true },
          group: { type: 'string' },
          type: { type: 'string', enum: ['BOS_CODE'] },
        },
        required: ['code', 'label', 'group', 'type', 'rufname'],
      },
    } as unknown as JSONSchemaType<BosOptaEntryDto[]>;
  }

  generateSchemaDistrict(): JSONSchemaType<DistrictEntryDto[]> {
    return {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          label: { type: 'string' },
          rufname: { type: 'string' },
          validFrom: { type: 'string', format: 'date-time', nullable: true },
          validUntil: { type: 'string', format: 'date-time', nullable: true },
          group: { type: 'string' },
          type: { type: 'string', enum: ['DISTRICT'] },
        },
        required: ['code', 'label', 'group', 'type', 'rufname'],
      },
    } as unknown as JSONSchemaType<DistrictEntryDto[]>;
  }

  generateSchemaLocalCodes(): JSONSchemaType<LocalCodeEntryDto[]> {
    return {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          label: { type: 'string' },
          validFrom: { type: 'string', format: 'date-time', nullable: true },
          validUntil: { type: 'string', format: 'date-time', nullable: true },
          group: { type: 'string' },
          type: { type: 'string', enum: ['LOCAL_CODE'] },
        },
        required: ['code', 'label', 'group', 'type'],
      },
    } as unknown as JSONSchemaType<LocalCodeEntryDto[]>;
  }
}
