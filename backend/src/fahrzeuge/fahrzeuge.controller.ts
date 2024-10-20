import { Body, Controller, Get, Patch, Res } from '@nestjs/common';
import { FahrzeugeService } from './fahrzeuge.service';
import { FahrzeugDto } from '../types';
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
}
