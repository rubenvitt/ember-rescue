import { Controller, Get, Logger } from '@nestjs/common';
import { AlarmstichwortService } from './alarmstichwort.service';

@Controller('alarmstichwort')
export class AlarmstichwortController {
  private readonly logger: Logger = new Logger(AlarmstichwortController.name);

  constructor(private readonly alarmstichwortService: AlarmstichwortService) {}

  @Get()
  getAlarmstichworte() {
    return this.alarmstichwortService.findAll();
  }
}
