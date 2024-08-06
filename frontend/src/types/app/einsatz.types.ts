import { Identifiable } from '../utils/common.types.js';
import { Alarmstichwort } from './alarmstichwort.types.js';

export type Einsatz = Identifiable & {
  id: string;
  beginn: string;
  ende: string | null;
  abgeschlossen: string | null;
  aufnehmendesRettungsmittelId: string;
  bearbeiterId: string;
  createdAt: string;
  updatedAt: string;
  einsatz_alarmstichwort?: {
    beschreibung: string;
    bezeichnung: string;
  };
};

export interface CreateEinsatz {
  erstAlarmiert: string;
  alarmstichwort?: string;
  aufnehmendesRettungsmittel?: string;
  einsatznummer?: string;
  adresse?: string;
}

export interface UpdateEinsatz {
  alarmstichwort: Alarmstichwort;
}