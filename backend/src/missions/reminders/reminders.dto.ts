import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty } from 'class-validator';
import { ApiResponse } from '../../types';

export class ReminderDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  timestamp: string;

  @ApiProperty({})
  notified: string;

  @ApiProperty({})
  read: string;

  @ApiProperty({ required: true })
  title: string;

  @ApiProperty({ required: true })
  content: string;

  @ApiProperty({})
  action?: string;
}

export class CreateReminderDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({})
  title: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({})
  content: string;

  @ApiProperty({})
  action?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({})
  @IsISO8601({ strict: true })
  timestamp: string;
}

export class OneReminderResponse extends ApiResponse<ReminderDto> {
  @ApiProperty({
    type: ReminderDto,
    required: true,
  })
  data: ReminderDto;
}

export class ManyReminderResponse extends ApiResponse<ReminderDto[]> {
  @ApiProperty({
    type: ReminderDto,
    required: true,
    isArray: true,
  })
  data: ReminderDto[];
}
