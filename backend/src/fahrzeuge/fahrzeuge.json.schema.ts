import { JSONSchemaType } from 'ajv';

interface Fahrzeug {
  funkrufname: string;
  fahrzeugTyp: string;
  kapazitaet: number;
}

const fahrzeugeSchema: JSONSchemaType<Fahrzeug> = {
  type: 'object',
  properties: {
    funkrufname: { type: 'string' },
    fahrzeugTyp: { type: 'string', enum: ['RTW', 'FüKW'] },
    kapazitaet: { type: 'number' },
  },
};
