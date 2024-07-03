import { Body, Controller, Get, Headers, Logger, Post } from '@nestjs/common';
import { EinsatztagebuchService } from './einsatztagebuch.service';
import { extractBearbeiterId, extractEinsatzId } from '../utils/header.utils';
import { CreateEinsatztagebuchDto } from '../types';

@Controller('einsatztagebuch')
export class EinsatztagebuchController {
  private readonly logger = new Logger(EinsatztagebuchController.name);

  constructor(private service: EinsatztagebuchService) {}

  @Get()
  async getEinsatztagebuch(
    @Headers('bearbeiter') bearbeiterHeader: string,
    @Headers('einsatz') einsatzHeader: string,
  ) {
    const einsatzId = extractEinsatzId(einsatzHeader);
    return this.service.getEinsatztagebuch(einsatzId);
  }

  @Post()
  async createEinsatztagebuchEintrag(
    @Headers('bearbeiter') bearbeiterHeader: string,
    @Headers('einsatz') einsatzHeader: string,
    @Body() createEinsatztagebuchDto: CreateEinsatztagebuchDto,
  ) {
    const bearbeiterId = extractBearbeiterId(bearbeiterHeader);
    const einsatzId = extractEinsatzId(einsatzHeader);
    this.logger.debug(`Creating Einsatztagebuch Eintrag`, {
      bearbeiterId,
      einsatzId,
    });
    return this.service.createEinsatztagebuchEintrag({
      bearbeiter: {
        connect: {
          id: bearbeiterId,
        },
      },
      einsatz: {
        connect: {
          id: einsatzId,
        },
      },
      ...createEinsatztagebuchDto,
    });
  }
}
