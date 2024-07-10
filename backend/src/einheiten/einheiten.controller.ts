import { Body, Controller, Get, Patch, Res } from '@nestjs/common';
import { EinheitenService } from './einheiten.service';
import { EinheitDto } from '../types';
import { Response } from 'express';

@Controller('einheiten')
export class EinheitenController {
  constructor(private readonly einheitenService: EinheitenService) {}

  @Get()
  findAll(): Promise<EinheitDto[]> {
    return this.einheitenService.findAll();
  }

  @Get('/typen')
  findAllTypen() {
    return this.einheitenService.findTypen();
  }

  @Patch()
  async updateMany(
    @Body() einheiten: Omit<EinheitDto, 'status'>[],
    @Res() response: Response,
  ) {
    await this.einheitenService.updateMany(einheiten);
    response.status(201);
    response.send({ status: 'Einheiten updated successfully' });
  }
}
