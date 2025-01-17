import { ApiProperty } from '@nestjs/swagger';
import { PersonalDto } from '../personal/personal.dto';
import { ApiResponse } from '../../types';
import { FahrzeugTemplateDto } from '@templates/vehicles/fahrzeuge.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddVehicleToMissionDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;
}

export class StatusDto {
  @ApiProperty({ required: true })
  code: string;

  @ApiProperty({ required: true })
  label: string;

  @ApiProperty({ required: true })
  description: string;
}

export class StatusHistoryEntryDto {
  @ApiProperty({ required: true })
  timestamp: string;

  @ApiProperty({ required: true })
  status: StatusDto;
}

export class ChangeStatusDto {
  @ApiProperty({ required: true })
  statusId: string;
}

export class VehicleOnMissionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullOpta: string;

  // FIXME[ember-rescue-68](rubeen, 30.11.24): fill this property
  @ApiProperty()
  optaFunktion: string;

  @ApiProperty({ required: true })
  einsatzbeginn: string;

  @ApiProperty()
  einsatzende: Date;

  @ApiProperty({ required: true, default: [] })
  personal: PersonalDto[];

  @ApiProperty({ required: true })
  kapazitaet: number;

  @ApiProperty({ required: true, default: [] })
  status_history: StatusHistoryEntryDto[];
}

export class VehiclesDto {
  @ApiProperty({ required: true, type: VehicleOnMissionDto, isArray: true })
  fahrzeugeImEinsatz: VehicleOnMissionDto[];

  @ApiProperty({ required: true, type: VehicleOnMissionDto, isArray: true })
  verfuegbareFahrzeuge: FahrzeugTemplateDto[];
}

export class VehiclesResponse extends ApiResponse<VehiclesDto> {
  @ApiProperty({
    type: VehiclesDto,
    required: true,
  })
  data: VehiclesDto;
}
