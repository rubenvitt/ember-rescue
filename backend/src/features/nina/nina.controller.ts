import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { NinaService } from './nina.service';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from '../../types';

class MyApiResponse extends ApiResponse<Object> {
  @ApiProperty({
    type: Object,
  })
  data: Object;
}

class MyMultiApiResponse extends ApiResponse<Object[]> {
  @ApiProperty({
    type: Object,
    isArray: true,
  })
  data: Object[];
}

@Controller('features/nina')
@UseGuards(BearbeiterGuard)
export class NinaController {
  constructor(private readonly ninaService: NinaService) {}

  @Get('/warnings.geojson')
  @ApiOkResponse({
    type: MyApiResponse,
  })
  getGeoJson() {
    return this.ninaService.fetchWarningsAsGeoJson();
  }

  @Get('/warning/:id')
  @ApiOkResponse({
    type: MyMultiApiResponse,
  })
  getWarningDetails(@Param('id') id: string) {
    return this.ninaService.fetchWarningDetails(id);
  }

  @Get('/warnings')
  @ApiOkResponse({
    type: MyMultiApiResponse,
  })
  getAllWarningDetails() {
    return this.ninaService.fetchAllWarningDetails();
  }
}
