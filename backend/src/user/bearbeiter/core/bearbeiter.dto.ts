import { ApiResponse } from '../../../types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BearbeiterDto {
  @ApiProperty({})
  _id: string;
  @ApiProperty({})
  name: string;
}

export class BearbeiterWithStatusDto extends BearbeiterDto {
  @ApiProperty({})
  active: boolean;

  @ApiProperty({})
  createdAt: string;

  @ApiProperty({})
  updatedAt: string;
}

export class CreateBearbeiterDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  name: string;
}

export class OneBearbeiterResponse extends ApiResponse<
  BearbeiterDto | undefined
> {
  @ApiProperty({
    type: BearbeiterDto,
    required: false,
  })
  data: BearbeiterDto | undefined;
}

export class ManyBearbeiterResponse extends ApiResponse<BearbeiterDto[]> {
  @ApiProperty({
    isArray: true,
    type: BearbeiterDto,
  })
  data: BearbeiterDto[];
}
