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
  UseGuards,
} from '@nestjs/common';
import { EinsatzCoreService } from './einsatz-core.service';
import { BearbeiterDto, CreateEinsatzDto, UpdateEinsatzDto } from '../../types';
import { BearbeiterCoreService } from '../../user/bearbeiter/core/bearbeiter-core.service';
import { AlarmstichwortRepository } from '@templates/alarmstichworte/alarmstichwort.repository';
import { CurrentBearbeiter } from '../../user/bearbeiter/core/bearbeiter.decorator';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';

@Controller('einsatz')
@UseGuards(BearbeiterGuard)
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
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Body() body: CreateEinsatzDto,
  ) {
    console.log('createEinsatz', body);
    return this.einsatzService.createEinsatz({
      bearbeiter: await this.bearbeiterService.findByNameOrCreate(
        bearbeiter.name,
      ),
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
