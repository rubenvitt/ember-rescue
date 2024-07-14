import {
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { EinsatzEinheitenService } from './einsatz-einheiten.service';
import { EinsatzController } from '../einsatz.controller';
import { extractBearbeiterId } from '../../utils/header.utils';

@Controller('einsatz/:einsatzId/einheiten')
export class EinsatzEinheitenController {
  private readonly logger = new Logger(EinsatzController.name);

  constructor(private readonly einheitenService: EinsatzEinheitenService) {}

  @Get()
  async findEinheitenImEinsatz(@Param('einsatzId') einsatzId: string) {
    this.logger.log('Find einheiten im Einsatz', einsatzId);
    return this.einheitenService.findEinheitenImEinsatz({ einsatzId });
  }

  @Post('/add')
  async addEinheitToEinsatz(
    @Param('einsatzId') einsatzId: string,
    @Headers('bearbeiter') bearbeiterHeader: string,
    @Body() body: { einheitId: string },
  ) {
    const bearbeiterId = extractBearbeiterId(bearbeiterHeader);
    this.logger.log('Add Einheit to Einsatz', einsatzId);
    await this.einheitenService.addEinheitToEinsatz(
      body.einheitId,
      einsatzId,
      bearbeiterId,
    );
  }
}
