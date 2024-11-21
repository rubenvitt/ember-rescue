import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { AlarmstichwortRepository } from './alarmstichwort.repository';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';

@Controller('alarmstichwort')
@UseGuards(BearbeiterGuard)
export class AlarmstichwortController {
  private readonly logger: Logger = new Logger(AlarmstichwortController.name);

  constructor(
    private readonly alarmstichwortService: AlarmstichwortRepository,
  ) {}

  @Get()
  getAlarmstichworte() {
    return this.alarmstichwortService.findActive();
  }
}
