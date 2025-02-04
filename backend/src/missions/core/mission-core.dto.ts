import { ApiProperty } from '@nestjs/swagger';
import { EinsatzAlarmstichwortDto } from '@templates/alarmstichworte/alarmstichwort.dto';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiResponse } from '../../types';
import { BearbeiterWithStatusDto } from '../../user/bearbeiter/core/bearbeiter.dto';
import { JournalDto } from '../journal/journal.dto';
import { EinsatzNoteDto } from '../notes/notes.dto';
import { ReminderDto } from '../reminders/reminders.dto';
import { VehicleOnMissionDto } from '../vehicles/vehicle.dto';

export class MissionMetaDto {
  @ApiProperty({ required: true })
  ort: string;
}

export class CreateMissionDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  erstAlarmiert: string;
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  aufnehmendesRettungsmittel: string;
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  alarmstichwort: string;
  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  ort: string;
}

export class UpdateMissionDto {
  @ApiProperty({ required: true })
  alarmstichwort: string;
  @ApiProperty({ required: true })
  ort: string;
  @ApiProperty({
    required: true,
    type: [String],
    description: 'Start and end times in ISO format',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @IsISO8601({ strict: true }, { each: true })
  timeframe: [string, string?];
}

export class SmallMissionDto {
  @ApiProperty({})
  _id: string;
  @ApiProperty({ description: 'Backend version of the server that created the mission' })
  backendVersion: string;
  @ApiProperty({ description: 'Whether the mission is compatible with the backend version' })
  backendCompatible: boolean;
  @ApiProperty({})
  aufnehmendesRettungsmittel: string;
  @ApiProperty({
    type: BearbeiterWithStatusDto,
  })
  bearbeiter: BearbeiterWithStatusDto;
  @ApiProperty({})
  beginn: string;
  @ApiProperty({})
  ende: string;
  @ApiProperty({
    type: EinsatzAlarmstichwortDto,
  })
  einsatzAlarmstichwort: EinsatzAlarmstichwortDto;
  @ApiProperty({
    type: MissionMetaDto,
  })
  einsatzMeta: MissionMetaDto;
}

export class MissionDto extends SmallMissionDto {
  @ApiProperty({})
  abgeschlossen: string;

  @ApiProperty({})
  einsatznummer: number;

  @ApiProperty({})
  einsatzTagebuch: JournalDto;

  @ApiProperty({})
  fahrzeuge: VehicleOnMissionDto[];

  @ApiProperty({})
  notizen: EinsatzNoteDto[];

  @ApiProperty({})
  reminders: ReminderDto[];
}

export class OneMissionResponse extends ApiResponse<MissionDto | undefined> {
  @ApiProperty({
    type: MissionDto,
    required: false,
  })
  data: MissionDto | undefined;
}

export class ManyMissionsResponse extends ApiResponse<MissionDto[]> {
  @ApiProperty({
    type: SmallMissionDto,
    required: true,
    isArray: true,
  })
  data: MissionDto[];
}
