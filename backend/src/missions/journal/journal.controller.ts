import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EinsatztagebuchService } from './einsatztagebuch.service';
import { BearbeiterDto } from '../../types';
import { CurrentBearbeiter } from '../../user/bearbeiter/core/bearbeiter.decorator';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import {
  CreateJournalEntryDto,
  JournalEntryResponse,
  JournalResponse,
} from './journal.dto';

@Controller('missions/:missionId/journal')
@UseGuards(BearbeiterGuard)
export class JournalController {
  private readonly logger = new Logger(JournalController.name);

  constructor(private service: EinsatztagebuchService) { }

  @Get()
  @ApiOkResponse({
    type: JournalResponse,
    description: 'Find journal for mission',
  })
  async getJournal(@Param('missionId') einsatzId: string) {
    let journal = await this.service.getEinsatztagebuch(einsatzId);
    this.logger.debug(`Get Einsatztagebuch`);
    return journal;
  }

  @Post()
  @ApiBody({
    type: CreateJournalEntryDto,
  })
  @ApiOkResponse({
    type: JournalEntryResponse,
    description: 'Create journal entry',
  })
  async createJournalEntry(
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Param('missionId') einsatzId: string,
    @Body() createEinsatztagebuchDto: CreateJournalEntryDto,
  ) {
    this.logger.debug(`Creating Einsatztagebuch Eintrag`, {
      bearbeiterId: bearbeiter.name,
      einsatzId,
      createEinsatztagebuchDto,
    });

    return this.service.createEinsatztagebuchEintrag(einsatzId!!, {
      bearbeiterId: bearbeiter.name,
      einsatzId,
      ...createEinsatztagebuchDto,
      type: createEinsatztagebuchDto.type ?? 'USER',
    });
  }

  @Post('/:nummer/archive')
  @ApiOkResponse({
    description: 'Archive Einsatztagebuch Eintrag',
  })
  async archiveJournalEntry(
    @Param('nummer') nummer: string,
    @Param('missionId') missionId: string,
  ) {
    return this.service.archiveEinsatztagebuchEintrag(nummer, missionId);
  }
}
