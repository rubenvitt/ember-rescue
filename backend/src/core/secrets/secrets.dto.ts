import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from '../../types';
import { IsNotEmpty, IsString } from 'class-validator';

export class SecretsDto {
  @ApiProperty({ required: true, description: 'The key of the secret' })
  @IsString()
  @IsNotEmpty()
  key: string;
  @ApiProperty({
    required: false,
    description: 'The value of the secret',
    type: String,
    nullable: true,
  })
  @IsString()
  value?: string | null;
}

export class SecretsResponse extends ApiResponse<SecretsDto> {
  @ApiProperty({
    type: SecretsDto,
    description: 'The secret',
  })
  data: SecretsDto;
}
