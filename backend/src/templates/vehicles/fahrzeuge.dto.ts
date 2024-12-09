import { ApiResponse } from '../../types';
import { ApiProperty } from '@nestjs/swagger';
import { FunctionGroup, OptaType } from '@templates/opta/constants';
import { OptaDto } from '@templates/opta/dtos/opta.dto';

export class IconDefinitionDto {
  @ApiProperty({ required: false })
  organisation?: string;
  @ApiProperty({ required: false })
  fachaufgabe?: string;
  @ApiProperty({ required: false })
  verwaltungsstufe?: string;
}

export class FahrzeugTemplateDto {
  @ApiProperty({ required: true })
  id?: string;

  @ApiProperty()
  opta: OptaDto;

  @ApiProperty()
  fullOpta: string;

  @ApiProperty({
    type: IconDefinitionDto,
  })
  iconDefinition: IconDefinitionDto;

  @ApiProperty()
  kapazitaet?: number;
}

export class FahrzeugTypDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  label: string;

  @ApiProperty({
    required: false,
  })
  description?: string;

  @ApiProperty({
    enum: OptaType,
  })
  type: OptaType;

  @ApiProperty({
    enum: FunctionGroup,
  })
  group: FunctionGroup;
}

export class ManyFahrzeugTypResponse extends ApiResponse<FahrzeugTypDto[]> {
  @ApiProperty({
    type: FahrzeugTypDto,
    isArray: true,
    description: 'List of vehicle types',
  })
  data: FahrzeugTypDto[];
}

//export type UpdateCreateFahrzeugeDto = {
//   _id: string | undefined;
//   opta: any; // TODO
//   iconDefinition: FahrzeugIconDefinitionDto;
// }[];

export class CreateUpdateFahrzeugDto {
  @ApiProperty({ required: false })
  _id?: string;

  @ApiProperty({ required: false })
  opta: OptaDto;

  @ApiProperty({ required: false })
  iconDefinition: IconDefinitionDto;
}

export class ImportManyFahrzeugeDto {
  @ApiProperty({ required: true, type: CreateUpdateFahrzeugDto, isArray: true })
  items: CreateUpdateFahrzeugDto[];
}

export class ManyFahrzeugeTemplateResponse extends ApiResponse<
  FahrzeugTemplateDto[]
> {
  @ApiProperty({
    type: FahrzeugTemplateDto,
    isArray: true,
    description: 'List of vehicles',
  })
  data: FahrzeugTemplateDto[];
}
