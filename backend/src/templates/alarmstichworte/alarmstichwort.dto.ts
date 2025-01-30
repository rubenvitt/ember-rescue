import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from '../../types';

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

export class ManyEinsatzAlarmstichwortDto extends ApiResponse<
  EinsatzAlarmstichwortDto[]
> {
  @ApiProperty({
    type: EinsatzAlarmstichwortDto,
    required: true,
    isArray: true,
  })
  data: EinsatzAlarmstichwortDto[];
}
