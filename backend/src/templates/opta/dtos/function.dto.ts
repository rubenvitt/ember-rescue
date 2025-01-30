import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from '../../../types';
import { BosGroup, FunctionGroup, LocalGroup } from '@templates/opta/constants';

class BaseOptaDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  validFrom: Date;
}

export class FunctionOptaDto extends BaseOptaDto {
  @ApiProperty({
    enum: FunctionGroup,
  })
  group: FunctionGroup;
}

export class DistrictOpta extends BaseOptaDto {}

export class LocalCodeOpta extends BaseOptaDto {
  @ApiProperty({
    enum: LocalGroup,
  })
  group: LocalGroup;
}

export class BosOpta extends BaseOptaDto {
  @ApiProperty({
    enum: BosGroup,
  })
  group: BosGroup;

  @ApiProperty({
    required: true,
  })
  rufname: string;
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

export class ManyDistrictOptaTemplatesResponse extends ApiResponse<
  DistrictOpta[]
> {
  @ApiProperty({
    type: DistrictOpta,
    isArray: true,
  })
  data: DistrictOpta[];
}

export class ManyLocalCodeOptaTemplatesResponse extends ApiResponse<
  LocalCodeOpta[]
> {
  @ApiProperty({
    type: LocalCodeOpta,
    isArray: true,
  })
  data: LocalCodeOpta[];
}

export class ManyBosOptaTemplatesResponse extends ApiResponse<BosOpta[]> {
  @ApiProperty({
    type: BosOpta,
    isArray: true,
  })
  data: BosOpta[];
}
