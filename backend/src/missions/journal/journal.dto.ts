import { ApiProperty } from '@nestjs/swagger';
import { EinsatztagebuchEintragEnum } from '../../types';

export class JournalEntryDto {
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
}

export class JournalDto {
  @ApiProperty({
    type: JournalEntryDto,
    isArray: true,
  })
  items: JournalEntryDto[];
}
