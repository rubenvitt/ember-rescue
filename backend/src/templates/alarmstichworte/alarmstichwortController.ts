import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { AlarmstichwortRepository } from './alarmstichwort.repository';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';
import { ApiOkResponse } from '@nestjs/swagger';
import { ManyEinsatzAlarmstichwortDto } from '@templates/alarmstichworte/alarmstichwort.dto';

@Controller('alarmstichwort')
@UseGuards(BearbeiterGuard)
export class AlarmstichwortController {
  private readonly logger: Logger = new Logger(AlarmstichwortController.name);

  constructor(
    private readonly alarmstichwortService: AlarmstichwortRepository,
  ) {}

  @Get()
  @ApiOkResponse({
    type: ManyEinsatzAlarmstichwortDto,
    description: 'List of all alarmstichworte',
  })
  getAlarmstichworte() {
    return this.alarmstichwortService.findActive();
  }
}
