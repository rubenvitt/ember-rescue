import { Controller, Get } from '@nestjs/common';
import { NinaService } from './nina.service';

@Controller('/apis/bund/nina')
export class NinaController {
  constructor(private readonly ninaService: NinaService) {}

  @Get('/warnings.geojson')
  getWarnings() {
    return this.ninaService.fetchWarnings();
  }
}
