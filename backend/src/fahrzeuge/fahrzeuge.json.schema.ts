import { JSONSchemaType } from 'ajv';
import { FahrzeugImportDto } from '../types';

const createFahrzeugSchema = (
  fahrzeugTypEnum: string[],
): JSONSchemaType<FahrzeugImportDto> => ({
  type: 'object',
  properties: {
    funkrufname: { type: 'string' },
    fahrzeugTyp: { type: 'string', enum: fahrzeugTypEnum },
    kapazitaet: { type: 'number' },
  },
  required: ['funkrufname', 'fahrzeugTyp', 'kapazitaet'],
  additionalProperties: false,
});

export { createFahrzeugSchema };
