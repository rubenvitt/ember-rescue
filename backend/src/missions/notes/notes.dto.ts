import { ApiProperty } from '@nestjs/swagger';

export class EinsatzNoteDto {
  @ApiProperty({ required: true })
  content: string;

  @ApiProperty({})
  doneAt: string;

  @ApiProperty({})
  deletedAt: string;
}
