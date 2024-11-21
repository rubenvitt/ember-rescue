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
import { EinsatzCoreService } from './einsatz-core.service';
import { CreateEinsatzDto, UpdateEinsatzDto } from '../../types';
import { extractBearbeiterName } from '../../utils/header.utils';
import { BearbeiterCoreService } from '../../user/bearbeiter/core/bearbeiter-core.service';
import { AlarmstichwortRepository } from '@templates/alarmstichworte/alarmstichwort.repository';

@Controller('einsatz')
export class EinsatzCoreController {
  private readonly logger = new Logger(EinsatzCoreController.name);

  constructor(
    private readonly einsatzService: EinsatzCoreService,
    private readonly bearbeiterService: BearbeiterCoreService,
    private readonly alarmstichwortService: AlarmstichwortRepository,
  ) {}

  @Get(':id')
  async getEinsatz(@Param('id') id: string) {
    return this.einsatzService.getEinsatz(id);
  }

  @Get()
  async getEinsaetze(
    @Query('abgeschlossen', new ParseBoolPipe({ optional: true }))
    abgeschlossen?: boolean,
  ) {
    let einsaetze = this.einsatzService.getEinsaetze({
      abgeschlossen: null,
    });
    this.logger.debug('getEinsaetze', {});
    return einsaetze;
  }

  @Post()
  async createEinsatz(
    @Headers('bearbeiter') bearbeiterHeader: string,
    @Body() body: CreateEinsatzDto,
  ) {
    const bearbeiterName = extractBearbeiterName(bearbeiterHeader)!!;
    console.log('createEinsatz', body);
    return this.einsatzService.createEinsatz({
      bearbeiter:
        await this.bearbeiterService.findByNameOrCreate(bearbeiterName),
      beginn: new Date(),
      aufnehmendesRettungsmittel: body.aufnehmendesRettungsmittel,
      einsatzAlarmstichwort: (await this.alarmstichwortService.findActiveById(
        body.alarmstichwort!!,
      ))!!,
      einsatzMeta: {},
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
    this.logger.log('Close Einsatz', { einsatzId });
    return this.einsatzService.closeEinsatz(einsatzId);
  }
}
