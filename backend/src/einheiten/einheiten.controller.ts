import { Controller, Get } from '@nestjs/common';
import { EinheitenService } from './einheiten.service';
import { EinheitDto } from '../types';

@Controller('einheiten')
export class EinheitenController {
  constructor(private readonly einheitenService: EinheitenService) {}

  @Get()
  findAll(): Promise<EinheitDto[]> {
    return this.einheitenService.findAll();
  }
}
