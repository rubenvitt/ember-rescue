import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from '../../types';
import { IsNotEmpty } from 'class-validator';

export class EinsatzNoteDto {
  @ApiProperty({ required: true })
  content: string;

  @ApiProperty({
    required: false,
    type: Date,
  })
  doneAt?: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  deletedAt?: Date;
}

export class CreateNotizDto {
  @IsNotEmpty()
  @ApiProperty()
  content: string;
}

export class ManyNoteResponse extends ApiResponse<EinsatzNoteDto[]> {
  @ApiProperty({
    type: EinsatzNoteDto,
    required: true,
    isArray: true,
  })
  data: EinsatzNoteDto[];
}
