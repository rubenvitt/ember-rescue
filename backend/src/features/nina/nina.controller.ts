import { Controller, Get, Param } from '@nestjs/common';
import { NinaService } from './nina.service';

@Controller('/apis/bund/nina')
export class NinaController {
  constructor(private readonly ninaService: NinaService) {}

  @Get('/warnings.geojson')
  getGeoJson() {
    return this.ninaService.fetchWarningsAsGeoJson();
  }

  @Get('/warning/:id')
  getWarningDetails(@Param('id') id: string) {
    return this.ninaService.fetchWarningDetails(id);
  }

  @Get('/warnings')
  getAllWarningDetails() {
    return this.ninaService.fetchAllWarningDetails();
  }
}
