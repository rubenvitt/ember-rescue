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
import { MissionCoreController } from '../core/mission-core.controller';
import { CurrentBearbeiter } from '../../user/bearbeiter/core/bearbeiter.decorator';
import { BearbeiterDto } from '../../types';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';
import { ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';
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

  constructor(private readonly fahrzeugeService: EinsatzFahrzeugeService) {}

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

    return {
      fahrzeugeImEinsatz: aktiveFahrzeuge,
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
      body.vehicleId,
      einsatzId,
      bearbeiter.name,
    );

    return { status: 'ok' };
  }

  @Post(':fahrzeugId/status')
  @ApiOkResponse({
    description: 'Change vehicle status',
  })
  @ApiBody({
    type: ChangeStatusDto,
  })
  @ApiParam({
    name: 'fahrzeugId',
    required: true,
    type: String,
    description: 'Fahrzeug ID',
  })
  @ApiParam({
    name: 'einsatzId',
    required: true,
    type: String,
    description: 'Einsatz ID',
  })
  async changeStatus(
    @Param('einsatzId') einsatzId: string,
    @Param('fahrzeugId') fahrzeugId: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Body() body: ChangeStatusDto,
  ) {
    await this.fahrzeugeService.changeStatus(
      fahrzeugId,
      einsatzId,
      bearbeiter.name,
      body,
    );

    return { status: 'ok' };
  }

  @Delete(':fahrzeugId')
  @ApiOkResponse({
    description: 'Remove vehicle from einsatz',
  })
  @ApiParam({
    name: 'fahrzeugId',
    required: true,
    type: String,
    description: 'Fahrzeug ID',
  })
  @ApiParam({
    name: 'einsatzId',
    required: true,
    type: String,
    description: 'Einsatz ID',
  })
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
