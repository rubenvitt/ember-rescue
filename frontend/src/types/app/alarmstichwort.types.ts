import { Identifiable, WithTimestamp } from '../utils/common.types.js';

export type Alarmstichwort = Identifiable & WithTimestamp & {
  bezeichnung: string, beschreibung: string
}