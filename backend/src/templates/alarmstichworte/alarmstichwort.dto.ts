import { ApiProperty } from '@nestjs/swagger';

export class EinsatzAlarmstichwortDto {
  @ApiProperty()
  _id: string;

  @ApiProperty({})
  code: string;

  @ApiProperty({})
  description: string;

  @ApiProperty({})
  isActive: boolean;

  @ApiProperty({})
  updatedAt: string;

  @ApiProperty({})
  createdAt: string;

  @ApiProperty({})
  validFrom: string;
}
