import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type BearbeiterDto = {
  id: string;
  name: string;
};

export type CreateBearbeiterDto = Omit<BearbeiterDto, 'id'>;

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

export type UpdateEinsatzDto = {
  alarmstichwort?: string;
};

export enum EinsatztagebuchEintragEnum {
  USER = 'USER',
  GENERISCH = 'GENERISCH',
  RESSOURCEN = 'RESSOURCEN',
  KOMMUNIKATION = 'KOMMUNIKATION',
  LAGE = 'LAGE',
  BETROFFENE = 'BETROFFENE',
}

export type EinsatztagebuchEintragType =
  keyof typeof EinsatztagebuchEintragEnum;

const EinsatztagebuchEintragTypesArray: EinsatztagebuchEintragType[] =
  Object.values(EinsatztagebuchEintragEnum) as EinsatztagebuchEintragType[];

export class CreateEinsatztagebuchDto {
  id?: never;

  @IsNotEmpty()
  @ApiProperty()
  content: string;
  @IsOptional()
  @IsIn(EinsatztagebuchEintragTypesArray)
  @ApiProperty({ enum: EinsatztagebuchEintragEnum })
  type?: EinsatztagebuchEintragType;
  @IsNotEmpty()
  @ApiProperty()
  absender: string;
  @IsNotEmpty()
  @ApiProperty()
  empfaenger: string;
  @IsNotEmpty()
  @ApiProperty({ pattern: 'YYYY-MM-ddThh:mm:ss' })
  timestamp: string;
}

export class CreateNotizDto {
  id?: never;

  @IsNotEmpty()
  @ApiProperty()
  content: string;
}

export class UpdateNotizDto {
  id?: never;

  @IsNotEmpty()
  @ApiProperty()
  content: string;
}
