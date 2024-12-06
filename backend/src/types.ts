import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FahrzeugIconDefinitionDto } from '@templates/vehicles/fahrzeug-template.schema';

export type BearbeiterDto = {
  name: string;
};

/**
 * @deprecated
 */
export type SmallStatusDto = {
  id: string;
  code: string;
  bezeichnung: string;
};

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
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
