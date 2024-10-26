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
import { FahrzeugDto, FahrzeugImportDto } from '../types';
import { Response } from 'express';
import { createFahrzeugSchema } from './fahrzeuge.json.schema';

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
    return this.fahrzeugeService.findTypen();
  }

  @Patch()
  async updateMany(
    @Body() fahrzeuge: Omit<FahrzeugDto, 'status'>[],
    @Res() response: Response,
  ) {
    await this.fahrzeugeService.updateMany(fahrzeuge);
    response.status(HttpStatus.CREATED);
    response.send({ status: 'Fahrzeuge updated successfully' });
  }

  @Get('/import/schema/v2')
  async getImportSchema() {
    let fahrzeugTypen = await this.fahrzeugeService.findTypen();
    return createFahrzeugSchema(fahrzeugTypen.map((typ) => typ.label));
  }

  @Post('/import')
  async importFahrzeuge(
    @Body() fahrzeuge: FahrzeugImportDto[],
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

    return allFahrzeuge.map((fahrzeug) => {
      return {
        funkrufname: fahrzeug.funkrufname,
        fahrzeugTyp: (fahrzeug.optaFunktion?.label ?? fahrzeug.label)!!,
        kapazitaet: fahrzeug.kapazitaet,
      } satisfies FahrzeugImportDto;
    });
  }
}
