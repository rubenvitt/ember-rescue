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
import { extractEinsatzId } from '../../utils/header.utils';
import { BearbeiterDto, CreateEinsatztagebuchDto } from '../../types';
import { CurrentBearbeiter } from '../../user/bearbeiter/core/bearbeiter.decorator';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';

@Controller('einsatztagebuch')
@UseGuards(BearbeiterGuard)
export class EinsatztagebuchController {
  private readonly logger = new Logger(EinsatztagebuchController.name);

  constructor(private service: EinsatztagebuchService) {}

  @Get()
  async getEinsatztagebuch(
    @Headers('bearbeiter') bearbeiterHeader: string,
    @Headers('einsatz') einsatzHeader: string,
  ) {
    const einsatzId = extractEinsatzId(einsatzHeader)!!;
    return this.service.getEinsatztagebuch(einsatzId);
  }

  @Post()
  async createEinsatztagebuchEintrag(
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Headers('einsatz') einsatzHeader: string,
    @Body() createEinsatztagebuchDto: CreateEinsatztagebuchDto,
  ) {
    const einsatzId = extractEinsatzId(einsatzHeader);
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
  async archiveEinsatztagebuchEintrag(@Param('id') id: string) {
    return this.service.archiveEinsatztagebuchEintrag(id);
  }
}
