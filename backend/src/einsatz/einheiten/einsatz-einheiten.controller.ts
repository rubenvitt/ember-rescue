import {
  Body,
  Controller,
  Delete,
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

    return { status: 'ok' };
  }

  @Post(':einheitId/status')
  async changeStatus(
    @Param('einsatzId') einsatzId: string,
    @Param('einheitId') einheitId: string,
    @Headers('bearbeiter') bearbeiterHeader: string,
    @Body() body: { statusId: string },
  ) {
    const bearbeiterId = extractBearbeiterId(bearbeiterHeader);
    this.logger.log(`Change status for ${einheitId} to ${body.statusId}`);
    await this.einheitenService.changeStatus(
      einheitId,
      einsatzId,
      bearbeiterId,
      { statusId: body.statusId },
    );

    return { status: 'ok' };
  }

  @Delete(':einheitId')
  async removeFromEinsatz(
    @Param('einsatzId') einsatzId: string,
    @Param('einheitId') einheitId: string,
    @Headers('bearbeiter') bearbeiterHeader: string,
  ) {
    const bearbeiterId = extractBearbeiterId(bearbeiterHeader);
    await this.einheitenService.removeEinheitFromEinsatz(
      einheitId,
      einsatzId,
      bearbeiterId,
    );

    return { status: 'ok' };
  }
}
