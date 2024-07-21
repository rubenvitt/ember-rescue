import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export type BearbeiterDto = {
  id: string;
  name: string;
};

export type NewBearbeiterDto = Omit<BearbeiterDto, 'id'>;

export type QualifikationDto = {
  id: string;
  bezeichnung: string;
  abkuerzung: string;
};

export type SmallStatusDto = {
  id: string;
  code: string;
  bezeichnung: string;
};

export type StatusDto = SmallStatusDto & {
  beschreibung: string;
};

export type EinheitDto = {
  id: string;
  funkrufname: string;
  einheitTyp: {
    id: string;
    label: string;
  };
  einheitTypId?: string;
  kapazitaet: number;
  istTemporaer: boolean;
  status: SmallStatusDto;
};

export type CreateEinsatzDto = {
  erstAlarmiert: string;
  aufnehmendesRettungsmittel: string;
  alarmstichwort?: string;
};

export enum EinsatztagebuchEintragEnum {
  USER = 'USER',
  GENERISCH = 'GENERISCH',
  RESSOURCEN = 'RESSOURCEN',
  KOMMUNIKATION = 'KOMMUNIKATION',
  LAGE = 'LAGE',
  PATIENTEN = 'PATIENTEN',
}

export type EinsatztagebuchEintragType =
  keyof typeof EinsatztagebuchEintragEnum;

const EinsatztagebuchEintragTypesArray: EinsatztagebuchEintragType[] =
  Object.values(EinsatztagebuchEintragEnum) as EinsatztagebuchEintragType[];

export class CreateEinsatztagebuchDto {
  @IsNotEmpty()
  content: string;
  @IsOptional()
  @IsIn(EinsatztagebuchEintragTypesArray)
  type?: EinsatztagebuchEintragType;
  @IsNotEmpty()
  absender: string;
  @IsNotEmpty()
  empfaenger: string;
  @IsNotEmpty()
  timestamp: string;
}
