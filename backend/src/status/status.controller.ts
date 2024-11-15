import { Controller, Get, Query } from '@nestjs/common';
import { StatusService } from './status.service';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  async status(@Query('code') code: number) {
    if (code) {
      return this.statusService.findStatusByCode(code);
    }
    return this.statusService.findAll();
  }

  @Get('/schema/v3')
  async schema() {
    return this.statusService.getSchema();
  }
}
