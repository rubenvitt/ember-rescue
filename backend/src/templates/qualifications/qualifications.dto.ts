import { ApiResponse } from '../../types';
import { ApiProperty } from '@nestjs/swagger';

export class QualificationDto {
  @ApiProperty({})
  _id: string;

  @ApiProperty({})
  label: string;
  @ApiProperty({})
  abkuerzung: string;
}

export class OneQualificationResponse extends ApiResponse<
  QualificationDto | undefined
> {
  @ApiProperty({
    type: QualificationDto,
    required: false,
  })
  data: QualificationDto | undefined;
}

export class ManyQualificationsResponse extends ApiResponse<
  QualificationDto[]
> {
  @ApiProperty({
    type: QualificationDto,
    required: true,
    isArray: true,
  })
  data: QualificationDto[];
}
