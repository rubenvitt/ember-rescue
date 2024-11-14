import { Identifiable, WithCreatedUpdatedAt } from '../utils/common.types.js';
import { Bearbeiter } from './bearbeiter.types.js';

export type Einsatz = Identifiable &
  WithCreatedUpdatedAt & {
    beginn: string;
    ende: string | null;
    abgeschlossen: string | null;
    einsatzAlarmstichwort?: {
      description: string;
      code: string;
    };
    bearbeiter: Bearbeiter;
    aufnehmendesRettungsmittel: string;

    einsatz_meta: EinsatzMeta;
  };

export type EinsatzMeta = Identifiable & {
  ort: string;
};

export interface CreateEinsatz {
  erstAlarmiert: string;
  alarmstichwort?: string;
  aufnehmendesRettungsmittel?: string;
  einsatznummer?: string;
  adresse?: string;
}

export interface UpdateEinsatz {
  alarmstichwort: string;
}
