import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from '../../../types';

export class FunctionOptaDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  group: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  label: string;

  @ApiProperty()
  maxPersonnel: number;

  @ApiProperty()
  minPersonnel: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  validFrom: Date;
}

export class ManyFunctionOptaTemplatesResponse extends ApiResponse<
  FunctionOptaDto[]
> {
  @ApiProperty({
    type: FunctionOptaDto,
    isArray: true,
  })
  data: FunctionOptaDto[];
}
