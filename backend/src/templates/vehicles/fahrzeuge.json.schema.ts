import { JSONSchemaType } from 'ajv';
import { FahrzeugImportDto } from '../../types';

const createFahrzeugSchema = (
  fahrzeugTypEnum: string[],
): JSONSchemaType<Omit<FahrzeugImportDto, 'fahrzeugTyp'>[]> => ({
  type: 'array',
  items: {
    type: 'object',
    properties: {
      funkrufname: { type: 'string' },
      kapazitaet: { type: 'number' },
    },
    required: ['funkrufname', 'kapazitaet'],
    additionalProperties: false,
  },
});

export { createFahrzeugSchema };
