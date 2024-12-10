import { ApiResponse } from '../../types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SettingsDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  mapboxApi: string | null;
}

export class SettingsResponse extends ApiResponse<SettingsDto> {
  @ApiProperty({
    type: SettingsDto,
    description: 'Application settings',
  })
  data: SettingsDto;
}
