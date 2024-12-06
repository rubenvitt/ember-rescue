import { ApiProperty } from '@nestjs/swagger';

export class OptaDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: false })
  district?: string;

  @ApiProperty({ required: false })
  bosCode?: string;

  @ApiProperty({ required: false })
  localCode?: string;

  @ApiProperty({ required: false })
  functionCode?: string;

  @ApiProperty({ required: false })
  orderNumber?: string;

  @ApiProperty({ required: false })
  ort?: string;

  @ApiProperty({ required: false })
  supplement?: string;

  @ApiProperty({ required: true })
  fullOpta: string;
}
