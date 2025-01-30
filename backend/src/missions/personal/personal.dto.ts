import { ApiProperty } from '@nestjs/swagger';

export class PersonalDto {
  @ApiProperty({})
  name: string;

  @ApiProperty({})
  qualifikation: string;

  @ApiProperty({})
  telefonnummer: string;

  @ApiProperty({})
  isFuehrungskraft: boolean;
}
