import { Body, Controller, Get, Patch, Post, Res } from '@nestjs/common';
import { FahrzeugeService } from './fahrzeuge.service';
import { FahrzeugDto, FahrzeugImportDto } from '../types';
import { Response } from 'express';

@Controller('fahrzeuge')
export class FahrzeugeController {
  constructor(private readonly fahrzeugeService: FahrzeugeService) {}

  @Get()
  findAll(): Promise<FahrzeugDto[]> {
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
    response.status(201);
    response.send({ status: 'Fahrzeuge updated successfully' });
  }

  @Post('/import')
  async importFahrzeuge(@Body() fahrzeuge: FahrzeugImportDto[]) {
    await this.fahrzeugeService.importFahrzeuge(fahrzeuge);
  }

  @Post('/export')
  async exportFahrzeuge() {
    let allFahrzeuge = await this.fahrzeugeService.findAll({
      istTemporaer: false,
    });

    return allFahrzeuge.map((fahrzeug) => {
      return {
        funkrufname: fahrzeug.funkrufname,
        fahrzeugTyp: fahrzeug.fahrzeugTyp.label,
        kapazitaet: fahrzeug.kapazitaet,
      } satisfies FahrzeugImportDto;
    });
  }
}
