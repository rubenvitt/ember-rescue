import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class OptaDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bosCode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  localCode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  functionCode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  orderNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ort?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  supplement?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fullOpta: string;
}
