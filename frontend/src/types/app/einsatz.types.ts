import { Identifiable, WithCreatedUpdatedAt } from '../utils/common.types.js';
import { Bearbeiter } from './bearbeiter.types.js';

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
export type EinsatzMeta = Identifiable & {
  ort: string;
};

/**
 * @deprecated
 */
export interface CreateEinsatz {
  erstAlarmiert: string;
  alarmstichwort?: string;
  aufnehmendesRettungsmittel?: string;
  einsatznummer?: string;
  adresse?: string;
}

/**
 * @deprecated
 */
export interface UpdateEinsatz {
  alarmstichwort: string;
}
