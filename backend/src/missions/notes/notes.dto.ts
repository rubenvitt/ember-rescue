import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from '../../types';
import { IsNotEmpty } from 'class-validator';
import { BearbeiterDto } from '../../user/bearbeiter/core/bearbeiter.dto';

export class EinsatzNoteDto {
  @ApiProperty({})
  _id: string;

  @ApiProperty({
    type: BearbeiterDto,
  })
  bearbeiter: BearbeiterDto;

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

  @ApiProperty()
  createdAt: string;
}

export class CreateNotizDto {
  @IsNotEmpty()
  @ApiProperty()
  content: string;
}

export class OneNoteResponse extends ApiResponse<EinsatzNoteDto> {
  @ApiProperty({
    type: EinsatzNoteDto,
    required: true,
  })
  data: EinsatzNoteDto;
}

export class ManyNoteResponse extends ApiResponse<EinsatzNoteDto[]> {
  @ApiProperty({
    type: EinsatzNoteDto,
    required: true,
    isArray: true,
  })
  data: EinsatzNoteDto[];
}
