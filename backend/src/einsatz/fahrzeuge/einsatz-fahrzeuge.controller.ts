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
import { EinsatzFahrzeugeService } from './einsatz-fahrzeuge.service';
import { EinsatzController } from '../einsatz.controller';
import { extractBearbeiterName } from '../../utils/header.utils';

@Controller('einsatz/:einsatzId/fahrzeuge')
export class EinsatzFahrzeugeController {
  private readonly logger = new Logger(EinsatzController.name);

  constructor(private readonly fahrzeugeService: EinsatzFahrzeugeService) {}

  @Get()
  async findFahrzeugeImEinsatz(@Param('einsatzId') einsatzId: string) {
    this.logger.log('Find fahrzeuge im Einsatz', einsatzId);
    return this.fahrzeugeService.findFahrzeugeImEinsatz({ einsatzId });
  }

  @Post('/add')
  async addFahrzeugToEinsatz(
    @Param('einsatzId') einsatzId: string,
    @Headers('bearbeiter') bearbeiterHeader: string,
    @Body() body: { fahrzeugId: string },
  ) {
    const bearbeiterName = extractBearbeiterName(bearbeiterHeader)!!;
    this.logger.log('Add Fahrzeug to Einsatz', {
      einsatzId,
      body,
      bearbeiterId: bearbeiterName,
    });
    await this.fahrzeugeService.addFahrzeugToEinsatz(
      body.fahrzeugId,
      einsatzId,
      bearbeiterName,
    );

    return { status: 'ok' };
  }

  @Post(':fahrzeugId/status')
  async changeStatus(
    @Param('einsatzId') einsatzId: string,
    @Param('fahrzeugId') fahrzeugId: string,
    @Headers('bearbeiter') bearbeiterHeader: string,
    @Body() body: { statusId: string },
  ) {
    const bearbeiterName = extractBearbeiterName(bearbeiterHeader)!!;
    this.logger.log(`Change status for ${fahrzeugId} to ${body.statusId}`);
    await this.fahrzeugeService.changeStatus(
      fahrzeugId,
      einsatzId,
      bearbeiterName,
      { statusId: body.statusId },
    );

    return { status: 'ok' };
  }

  @Delete(':fahrzeugId')
  async removeFromEinsatz(
    @Param('einsatzId') einsatzId: string,
    @Param('fahrzeugId') fahrzeugId: string,
    @Headers('bearbeiter') bearbeiterHeader: string,
  ) {
    const bearbeiterName = extractBearbeiterName(bearbeiterHeader)!!;
    await this.fahrzeugeService.removeFahrzeugFromEinsatz(
      fahrzeugId,
      einsatzId,
      bearbeiterName,
    );

    return { status: 'ok' };
  }
}
