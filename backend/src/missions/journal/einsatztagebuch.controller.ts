import {
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EinsatztagebuchService } from './einsatztagebuch.service';
import { BearbeiterDto, CreateEinsatztagebuchDto } from '../../types';
import { CurrentBearbeiter } from '../../user/bearbeiter/core/bearbeiter.decorator';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';

@Controller('missions/:missionId/journal')
@UseGuards(BearbeiterGuard)
export class EinsatztagebuchController {
  private readonly logger = new Logger(EinsatztagebuchController.name);

  constructor(private service: EinsatztagebuchService) {}

  @Get()
  async getEinsatztagebuch(
    @Headers('bearbeiter') bearbeiterHeader: string,
    @Param('missionId') einsatzId: string,
  ) {
    return this.service.getEinsatztagebuch(einsatzId);
  }

  @Post()
  async createEinsatztagebuchEintrag(
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Param('missionId') einsatzId: string,
    @Body() createEinsatztagebuchDto: CreateEinsatztagebuchDto,
  ) {
    this.logger.debug(`Creating Einsatztagebuch Eintrag`, {
      bearbeiterId: bearbeiter.name,
      einsatzId,
    });
    return this.service.createEinsatztagebuchEintrag(einsatzId!!, {
      bearbeiterId: bearbeiter.name,
      einsatzId,
      ...createEinsatztagebuchDto,
      type: createEinsatztagebuchDto.type ?? 'USER',
    });
  }

  @Post('/:id/archive')
  async archiveEinsatztagebuchEintrag(
    @Param('id') id: string,
    @Param('missionId') missionId: string,
  ) {
    return this.service.archiveEinsatztagebuchEintrag(id, missionId);
  }
}
