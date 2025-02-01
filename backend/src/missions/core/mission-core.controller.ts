import { CacheKey } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param, Post,
  Put, UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AlarmstichwortRepository } from '@templates/alarmstichworte/alarmstichwort.repository';
import { BearbeiterDto } from '../../types';
import { BearbeiterCoreService } from '../../user/bearbeiter/core/bearbeiter-core.service';
import { CurrentBearbeiter } from '../../user/bearbeiter/core/bearbeiter.decorator';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';
import { EinsatzCoreService } from './einsatz-core.service';
import {
  CreateMissionDto,
  ManyMissionsResponse,
  OneMissionResponse,
  UpdateMissionDto,
} from './mission-core.dto';

@Controller('missions')
@UseGuards(BearbeiterGuard)
export class MissionCoreController {
  private readonly logger = new Logger(MissionCoreController.name);

  constructor(
    private readonly einsatzService: EinsatzCoreService,
    private readonly bearbeiterService: BearbeiterCoreService,
    private readonly alarmstichwortService: AlarmstichwortRepository,
  ) {}

  @Get(':id')
  @CacheKey('mission')
  @ApiBearerAuth('Bearbeiter')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Einsatz ID',
  })
  @ApiOkResponse({
    description: 'Einsatz',
    type: OneMissionResponse,
  })
  async getMission(@Param('id') id: string) {
    return this.einsatzService.getEinsatz(id);
  }

  @Get()
  @CacheKey('missions')
  @ApiQuery({
    type: Boolean,
    name: 'abgeschlossen',
    required: false,
  })
  @ApiOkResponse({
    type: ManyMissionsResponse,
    description: 'List of all missions',
  })
  async getMissions() {
    let einsaetze = await this.einsatzService.getEinsaetze({
      abgeschlossen: null,
    });
    this.logger.debug('getEinsaetze', {});
    return {
      data: einsaetze,
      meta: {
        pagination: {
          page: 0,
          limit: 100,
          total: einsaetze.length,
          totalPages: 1,
        },
      },
    };
  }

  @Post()
  @ApiOkResponse({
    type: OneMissionResponse,
  })
  @ApiBody({
    type: CreateMissionDto,
    required: true,
  })
  async createEinsatz(
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Body() body: CreateMissionDto,
  ) {
    console.log('createEinsatz', body);
    return this.einsatzService.createEinsatz(body, (await this.bearbeiterService.findByNameOrCreate(bearbeiter.name))!!);
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Einsatz ID',
  })
  @ApiOkResponse({
    description: 'Change Einsatz',
    type: OneMissionResponse,
  })
  @ApiBody({
    type: UpdateMissionDto,
    required: true,
  })
  async changeEinsatz(
    @Param('id') einsatzId: string,
    @Body() updateMissionDto: UpdateMissionDto,
  ) {
    this.logger.debug('UpdateEinsatzDto', {
      updateEinsatzDto: updateMissionDto,
    });
    return this.einsatzService.changeEinsatz(einsatzId, updateMissionDto);
  }

  @Put('/:id/close')
  @ApiOkResponse({
    description: 'Close Einsatz',
    type: OneMissionResponse,
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Einsatz ID',
  })
  async closeEinsatz(@Param('id') einsatzId: string) {
    this.logger.log('Close Einsatz', { einsatzId });
    return this.einsatzService.closeEinsatz(einsatzId);
  }
}
