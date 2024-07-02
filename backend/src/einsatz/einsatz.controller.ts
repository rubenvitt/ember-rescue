import {
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Param,
  ParseBoolPipe,
  Post,
  Query,
} from '@nestjs/common';
import { EinsatzService } from './einsatz.service';
import { CreateEinsatzDto } from '../types';

@Controller('einsatz')
export class EinsatzController {
  private readonly logger = new Logger(EinsatzController.name);

  constructor(private readonly einsatzService: EinsatzService) {}

  @Get(':id')
  async getEinsatz(@Param('id') id: string) {
    // the
    return this.einsatzService.getEinsatz(id);
  }

  @Get()
  async getEinsaetze(
    @Query('abgeschlossen', new ParseBoolPipe({ optional: true }))
    abgeschlossen?: boolean,
  ) {
    return this.einsatzService.getEinsaetze({
      abgeschlossen: abgeschlossen ? { not: null } : null,
    });
  }

  @Post()
  async createEinsatz(
    @Headers('bearbeiter') bearbeiterId: string,
    @Body() body: CreateEinsatzDto,
  ) {
    console.log('createEinsatz', body);
    return this.einsatzService.createEinsatz({
      bearbeiter: {
        connect: {
          id: bearbeiterId.split('BearbeiterId ')[1],
        },
      },
      beginn: new Date(),
      aufnehmendes_rettungsmittel: {
        connect: {
          id: body.aufnehmendesRettungsmittel,
        },
      },
    });
  }
}
