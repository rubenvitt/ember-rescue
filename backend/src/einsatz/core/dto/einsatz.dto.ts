import { BearbeiterDto } from '../../../user/bearbeiter/core/bearbeiter.schema';
import { CreateEinsatzDto } from '../../schema/einsatz.schema';
import { AlarmstichwortDto } from '@templates/alarmstichworte/alarmstichwort.schema';

export class CreateEinsatzParams {
  bearbeiter: BearbeiterDto;
  createEinsatzDto: CreateEinsatzDto;
}

export class EinsatzDto {
  id: string;
  nummer: number;
  beginn: Date;
  bearbeiter: BearbeiterDto;
  alarmstichwort: AlarmstichwortDto;
  aufnehmendesRettungsmittel: string;
  einsatzMeta: EinsatzMetaDto;
}

export class EinsatzMetaDto {
  ort?: string;
  bemerkung?: string;
  sondersignale?: boolean;
}
