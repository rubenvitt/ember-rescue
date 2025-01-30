import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse, EinsatztagebuchEintragEnum } from '../../types';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

const JournalEntryTypesArray: JournalEntryType[] = Object.values(
  EinsatztagebuchEintragEnum,
) as JournalEntryType[];

export type JournalEntryType = keyof typeof EinsatztagebuchEintragEnum;

export class JournalEntryDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: true })
  timestamp: string;

  @ApiProperty({ required: true })
  content: string;

  @ApiProperty({ required: true })
  sender: string;

  @ApiProperty({ required: true })
  receiver: string;

  @ApiProperty({ required: true, default: false })
  archived: boolean;

  @ApiProperty({ required: true })
  nummer: number;

  @ApiProperty({ required: true, enum: EinsatztagebuchEintragEnum })
  type: EinsatztagebuchEintragEnum;

  @ApiProperty({ required: true })
  bearbeiter: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class JournalDto {
  @ApiProperty({
    type: JournalEntryDto,
    isArray: true,
  })
  items: JournalEntryDto[];
}

export class CreateJournalEntryDto {
  id?: never;

  @IsNotEmpty()
  @ApiProperty()
  content: string;
  @IsOptional()
  @IsIn(JournalEntryTypesArray)
  @ApiProperty({ enum: EinsatztagebuchEintragEnum })
  type?: JournalEntryType;
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

export class JournalResponse extends ApiResponse<JournalDto> {
  @ApiProperty({
    type: JournalDto,
  })
  data: JournalDto;
}

export class JournalEntryResponse extends ApiResponse<JournalEntryDto> {
  @ApiProperty({
    type: JournalEntryDto,
  })
  data: JournalEntryDto;
}
