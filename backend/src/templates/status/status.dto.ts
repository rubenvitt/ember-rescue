import { ApiResponse } from '../../types';
import { ApiProperty } from '@nestjs/swagger';

export class StatusDto {
  @ApiProperty({})
  id: string;
  @ApiProperty({})
  code: number;
  @ApiProperty({})
  label: string;
  @ApiProperty({})
  description: string;
}

export class ManyStatusDtoReponse extends ApiResponse<StatusDto[]> {
  @ApiProperty({
    type: StatusDto,
    isArray: true,
  })
  data: StatusDto[];
}
