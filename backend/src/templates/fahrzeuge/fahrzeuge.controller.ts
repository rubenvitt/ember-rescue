import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { FahrzeugeService } from './fahrzeuge.service';
import { UpdateCreateFahrzeugeDto } from '../../types';
import { Response } from 'express';

@Controller('fahrzeuge')
export class FahrzeugeController {
  private readonly logger = new Logger(FahrzeugeController.name);
  constructor(private readonly fahrzeugeService: FahrzeugeService) {}

  @Get()
  findAll() {
    return this.fahrzeugeService.findAll();
  }

  @Get('/typen')
  findAllTypen() {
    // FIXME[ember-rescue-68](rubeen, 14.11.24): Typen
    return [];
  }

  @Patch()
  async updateMany(
    @Body() fahrzeuge: UpdateCreateFahrzeugeDto,
    @Res() response: Response,
  ) {
    await this.fahrzeugeService.updateMany(fahrzeuge);
    response.status(HttpStatus.CREATED);
    response.send({ status: 'Fahrzeuge updated successfully' });
  }

  @Get('/import/schema/v2')
  async getImportSchema() {
    // FIXME[ember-rescue-68](rubeen, 14.11.24): Typen
    let fahrzeugTypen = [];
    return fahrzeugTypen;
    //return createFahrzeugSchema(fahrzeugTypen.map((typ) => typ.label));
  }

  @Post('/import')
  async importFahrzeuge(
    @Body() fahrzeuge: UpdateCreateFahrzeugeDto,
    @Res() response: Response,
  ) {
    this.logger.debug(
      'Importing fahrzeuge',
      JSON.stringify(fahrzeuge, null, 2),
    );
    await this.fahrzeugeService.importFahrzeuge(fahrzeuge);
    response.status(HttpStatus.OK);
    response.send({ status: 'Fahrzeuge updated successfully' });
  }

  @Get('export')
  async exportFahrzeuge() {
    let allFahrzeuge = await this.fahrzeugeService.findAll({
      istTemporaer: false,
    });
  }
}
