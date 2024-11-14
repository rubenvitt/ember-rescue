import {
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { EinsatztagebuchService } from './einsatztagebuch.service';
import { extractBearbeiterName, extractEinsatzId } from '../utils/header.utils';
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
    const einsatzId = extractEinsatzId(einsatzHeader)!!;
    return this.service.getEinsatztagebuch(einsatzId);
  }

  @Post()
  async createEinsatztagebuchEintrag(
    @Headers('bearbeiter') bearbeiterHeader: string,
    @Headers('einsatz') einsatzHeader: string,
    @Body() createEinsatztagebuchDto: CreateEinsatztagebuchDto,
  ) {
    const bearbeiterName = extractBearbeiterName(bearbeiterHeader)!!;
    const einsatzId = extractEinsatzId(einsatzHeader);
    this.logger.debug(`Creating Einsatztagebuch Eintrag`, {
      bearbeiterId: bearbeiterName,
      einsatzId,
    });
    return this.service.createEinsatztagebuchEintrag(einsatzId!!, {
      bearbeiterId: bearbeiterName,
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
