import { Identifiable } from '../utils/common.types.js';

export type StatusCode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'none';

export type SmallStatusDto = Identifiable & {
  id: string;
  code: StatusCode;
  bezeichnung: string;
};

export type StatusDto = SmallStatusDto & {
  beschreibung: string;
};
