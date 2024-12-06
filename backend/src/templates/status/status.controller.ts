import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatusService } from './status.service';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { ManyStatusDtoReponse } from '@templates/status/status.dto';

@Controller('templates/status')
@UseGuards(BearbeiterGuard)
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  @ApiOkResponse({
    type: ManyStatusDtoReponse,
    description: 'List of all status',
  })
  @ApiQuery({
    type: Number,
    name: 'code',
    required: false,
    description: 'Filter by code',
  })
  async status(@Query('code') code?: number) {
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
