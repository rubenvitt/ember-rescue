import { ApiProperty } from '@nestjs/swagger';
import { Prop } from '@nestjs/mongoose';

export class EinsatzReminderDto {
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

  @Prop({})
  action?: string;
}
