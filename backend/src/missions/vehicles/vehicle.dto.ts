import { ApiProperty } from '@nestjs/swagger';
import { PersonalDto } from '../personal/personal.dto';

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

export class VehicleOnMissionDto {
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
