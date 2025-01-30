import { CreateEinsatzDto } from '../../schema/einsatz.schema';
import { AlarmstichwortDto } from '@templates/alarmstichworte/alarmstichwort.schema';

import { BearbeiterDto } from '../../../user/bearbeiter/core/bearbeiter.dto';

/**
 * @deprecated
 */
export class CreateEinsatzParams {
  createEinsatzDto: CreateEinsatzDto;
}

/**
 * @deprecated
 */
export class EinsatzDto {
  id: string;
  nummer: number;
  beginn: Date;
  bearbeiter: BearbeiterDto;
  alarmstichwort: AlarmstichwortDto;
  aufnehmendesRettungsmittel: string;
  einsatzMeta: EinsatzMetaDto;
}

/**
 * @deprecated
 */
export class EinsatzMetaDto {
  ort?: string;
  bemerkung?: string;
  sondersignale?: boolean;
}
