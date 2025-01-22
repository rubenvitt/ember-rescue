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
import { ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { BearbeiterDto } from '../../types';
import { CurrentBearbeiter } from '../../user/bearbeiter/core/bearbeiter.decorator';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';
import { MissionCoreController } from '../core/mission-core.controller';
import { EinsatzFahrzeugeService } from './einsatz-fahrzeuge.service';
import {
  AddVehicleToMissionDto,
  ChangeStatusDto,
  VehiclesDto,
  VehiclesResponse,
} from './vehicle.dto';

@Controller('missions/:einsatzId/vehicles')
@UseGuards(BearbeiterGuard)
export class EinsatzFahrzeugeController {
  private readonly logger = new Logger(MissionCoreController.name);

  constructor(private readonly fahrzeugeService: EinsatzFahrzeugeService) { }

  @Get()
  @ApiOkResponse({
    type: VehiclesResponse,
    description: 'List of active and available vehicles',
  })
  async findFahrzeugeImEinsatz(
    @Param('einsatzId') einsatzId: string,
  ): Promise<VehiclesDto> {
    this.logger.log('Find fahrzeuge im Einsatz', einsatzId);

    const [aktiveFahrzeuge, verfuegbareFahrzeuge] = await Promise.all([
      this.fahrzeugeService.findAktiveFahrzeugeImEinsatz(einsatzId),
      this.fahrzeugeService.findVerfuegbareFahrzeuge(einsatzId),
    ]);

    const resolvedAktiveFahrzeuge = await Promise.all(aktiveFahrzeuge);
    this.logger.log({ verfuegbareFahrzeuge });

    return {
      fahrzeugeImEinsatz: resolvedAktiveFahrzeuge,
      verfuegbareFahrzeuge: verfuegbareFahrzeuge,
    };
  }

  @Post('/add')
  @ApiOkResponse({
    description: 'Add vehicle to einsatz',
  })
  @ApiBody({
    type: AddVehicleToMissionDto,
  })
  async addFahrzeugToEinsatz(
    @Param('einsatzId') einsatzId: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Body() body: AddVehicleToMissionDto,
  ) {
    await this.fahrzeugeService.addFahrzeugToEinsatz(
      body.fullOpta,
      einsatzId,
      bearbeiter.name,
    );

    return { status: 'ok' };
  }

  @Post('status')
  @ApiOkResponse({
    description: 'Change vehicle status',
  })
  @ApiBody({
    type: ChangeStatusDto,
  })
  @ApiParam({
    name: 'einsatzId',
    required: true,
    type: String,
    description: 'Einsatz ID',
  })
  async changeStatus(
    @Param('einsatzId') einsatzId: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Body() body: ChangeStatusDto,
  ) {
    this.logger.log('Change status', { einsatzId, body });
    await this.fahrzeugeService.changeStatus(
      einsatzId,
      bearbeiter.name,
      body,
    );

    return { status: 'ok' };
  }

  @Delete(':fullOpta')
  @ApiOkResponse({
    description: 'Remove vehicle from einsatz',
  })
  @ApiParam({
    name: 'fullOpta',
    required: true,
    type: String,
    description: 'FullOpta of vehicle to remove',
  })
  @ApiParam({
    name: 'einsatzId',
    required: true,
    type: String,
    description: 'Einsatz ID',
  })
  async removeFromEinsatz(
    @Param('einsatzId') einsatzId: string,
    @Param('fullOpta') fullOpta: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
  ) {
    await this.fahrzeugeService.removeFahrzeugFromEinsatz(
      fullOpta,
      einsatzId,
      bearbeiter.name,
    );

    return { status: 'ok' };
  }
}
