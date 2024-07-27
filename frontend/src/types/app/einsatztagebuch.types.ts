import { IdentifiableWithTimestampAndBearbeiter } from '../utils/common.types.js';

import { Bearbeiter } from './bearbeiter.types.js';

export type EinsatztagebuchTypes =
  'USER' |
  'GENERISCH' |
  'RESSOURCEN' |
  'KOMMUNIKATION' |
  'LAGE' |
  'BETROFFENE';

export type EinsatztagebuchEintrag = IdentifiableWithTimestampAndBearbeiter & {
  bearbeiter: Bearbeiter;
  type?: EinsatztagebuchTypes;
  content: string;
  archived: boolean;
  absender: string;
  empfaenger: string;
  createdAt: string;
};

export type CreateEinsatztagebuchEintrag = Omit<EinsatztagebuchEintrag, 'id' | 'bearbeiter' | 'archived' | 'createdAt'>