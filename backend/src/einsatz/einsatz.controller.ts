import {
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Param,
  ParseBoolPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { EinsatzService } from './einsatz.service';
import { CreateEinsatzDto, UpdateEinsatzDto } from '../types';
import { extractBearbeiterId } from '../utils/header.utils';

@Controller('einsatz')
export class EinsatzController {
  private readonly logger = new Logger(EinsatzController.name);

  constructor(private readonly einsatzService: EinsatzService) {}

  @Get(':id')
  async getEinsatz(@Param('id') id: string) {
    // the
    return this.einsatzService.getEinsatz(id);
  }

  @Get()
  async getEinsaetze(
    @Query('abgeschlossen', new ParseBoolPipe({ optional: true }))
    abgeschlossen?: boolean,
  ) {
    return this.einsatzService.getEinsaetze({
      abgeschlossen: abgeschlossen ? { not: null } : null,
    });
  }

  @Post()
  async createEinsatz(
    @Headers('bearbeiter') bearbeiterHeader: string,
    @Body() body: CreateEinsatzDto,
  ) {
    const bearbeiterId = extractBearbeiterId(bearbeiterHeader);
    console.log('createEinsatz', body);
    return this.einsatzService.createEinsatz({
      bearbeiter: {
        connect: {
          id: bearbeiterId,
        },
      },
      beginn: new Date(),
      aufnehmendes_rettungsmittel: {
        connect: {
          id: body.aufnehmendesRettungsmittel,
        },
      },
      einsatz_alarmstichwort: {
        create: {
          alarmstichwortId: body.alarmstichwort,
        },
      },
    });
  }

  @Put(':id')
  async changeEinsatz(
    @Param('id') einsatzId: string,
    @Headers('bearbeiter') bearbeiterId: string,
    @Body() updateEinsatzDto: UpdateEinsatzDto,
  ) {
    this.logger.log('Change EinsatzDaten', { einsatzId });
    this.logger.debug('UpdateEinsatzDto', { updateEinsatzDto });
    return this.einsatzService.changeEinsatz(einsatzId, updateEinsatzDto);
  }

  @Put('/:id/close')
  async closeEinsatz(
    @Headers('bearbeiter') bearbeiterId: string,
    @Param('id') einsatzId: string,
  ) {
    this.logger.log('Einsatz geschlossen', { einsatzId });
    return this.einsatzService.closeEinsatz(einsatzId);
  }
}
