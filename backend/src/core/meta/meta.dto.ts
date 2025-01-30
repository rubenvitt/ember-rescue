import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from '../../types';

export class MetaDto {
  @ApiProperty()
  version: string;
  @ApiProperty()
  serverName: string;
  @ApiProperty()
  serverId: string;
}

export class MetaResponse extends ApiResponse<MetaDto> {
  @ApiProperty({
    type: MetaDto,
    description: 'Information about the server.',
  })
  data: MetaDto;
}
