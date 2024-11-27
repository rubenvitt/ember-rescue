import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FahrzeugIconDefinitionDto } from '@templates/vehicles/fahrzeug-template.schema';

export type BearbeiterDto = {
  name: string;
};

export type SmallStatusDto = {
  id: string;
  code: string;
  bezeichnung: string;
};

export type StatusDto = SmallStatusDto & {
  beschreibung: string;
};

export type UpdateCreateFahrzeugeDto = {
  _id: string | undefined;
  opta: any; // TODO
  iconDefinition: FahrzeugIconDefinitionDto;
}[];

export type FahrzeugDto = {
  id: string;
  funkrufname: string;
  optaOrt: {
    code: number;
  };
  optaFunktion: {
    code: number;
  };
  fahrzeugTypId?: string;
  kapazitaet: number;
  istTemporaer: boolean;
  status: SmallStatusDto;
};

export class FahrzeugImportDto {
  funkrufname: string;
  fahrzeugTyp: string;
  kapazitaet: number;
}

/**
 * @deprecated
 */
export type UpdateEinsatzDto = {
  alarmstichwort: string;
  ort: string;
  timeframe: [string, string?];
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
  @ApiProperty({})
  content: string;
}

class ApiPagination {
  @ApiProperty({})
  page: number;
  @ApiProperty({})
  limit: number;
  @ApiProperty({})
  total: number;
  @ApiProperty({})
  totalPages: number;
}

class ApiMeta {
  @ApiProperty({})
  pagination?: ApiPagination;
  @ApiProperty({})
  timestamp: string;
}

export abstract class ApiResponse<T> {
  data: T;
  @ApiProperty({})
  meta?: ApiMeta;
  message?: string;
}
