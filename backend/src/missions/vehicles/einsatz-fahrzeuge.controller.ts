import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EinsatzFahrzeugeService } from './einsatz-fahrzeuge.service';
import { EinsatzCoreController } from '../core/einsatz-core.controller';
import { CurrentBearbeiter } from '../../user/bearbeiter/core/bearbeiter.decorator';
import { BearbeiterDto } from '../../types';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';

@Controller('missions/:einsatzId/vehicles')
@UseGuards(BearbeiterGuard)
export class EinsatzFahrzeugeController {
  private readonly logger = new Logger(EinsatzCoreController.name);

  constructor(private readonly fahrzeugeService: EinsatzFahrzeugeService) {}

  @Get()
  async findFahrzeugeImEinsatz(@Param('einsatzId') einsatzId: string) {
    this.logger.log('Find fahrzeuge im Einsatz', einsatzId);
    return this.fahrzeugeService.findFahrzeugeImEinsatz({ einsatzId });
  }

  @Post('/add')
  async addFahrzeugToEinsatz(
    @Param('einsatzId') einsatzId: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Body() body: { fahrzeugId: string },
  ) {
    await this.fahrzeugeService.addFahrzeugToEinsatz(
      body.fahrzeugId,
      einsatzId,
      bearbeiter.name,
    );

    return { status: 'ok' };
  }

  @Post(':fahrzeugId/status')
  async changeStatus(
    @Param('einsatzId') einsatzId: string,
    @Param('fahrzeugId') fahrzeugId: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Body() body: { statusId: string },
  ) {
    await this.fahrzeugeService.changeStatus(
      fahrzeugId,
      einsatzId,
      bearbeiter.name,
      { statusId: body.statusId },
    );

    return { status: 'ok' };
  }

  @Delete(':fahrzeugId')
  async removeFromEinsatz(
    @Param('einsatzId') einsatzId: string,
    @Param('fahrzeugId') fahrzeugId: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
  ) {
    await this.fahrzeugeService.removeFahrzeugFromEinsatz(
      fahrzeugId,
      einsatzId,
      bearbeiter.name,
    );

    return { status: 'ok' };
  }
}
