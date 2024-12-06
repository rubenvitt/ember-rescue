import { ApiResponse } from '../../types';
import { ApiProperty } from '@nestjs/swagger';

export class SettingsDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  mapboxApi: string | null;
}

export class SettingsResponse extends ApiResponse<SettingsDto> {
  @ApiProperty({
    type: SettingsDto,
    description: 'Application settings',
  })
  data: SettingsDto;
}
