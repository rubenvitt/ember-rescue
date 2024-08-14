import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { NotizenService } from './notizen.service';
import { extractBearbeiterId, extractEinsatzId } from '../utils/header.utils';
import { CreateNotizDto, UpdateNotizDto } from '../types';

@Controller(`notizen`)
export class NotizenController {
  private readonly logger = new Logger(NotizenController.name);

  constructor(private readonly notizenService: NotizenService) {}

  @Get()
  getNotizen(
    @Headers('einsatz') einsatzHeader: string,
    @Headers('bearbeiter') bearbeiterHeader: string,
    @Query('done') done: boolean = false,
  ) {
    const bearbeiterId = extractBearbeiterId(bearbeiterHeader);
    const einsatzId = extractEinsatzId(einsatzHeader);
    return this.notizenService.findAllNotizen(einsatzId, bearbeiterId, done);
  }

  @Post()
  createNotiz(
    @Headers('einsatz') einsatzHeader: string,
    @Headers('bearbeiter') bearbeiterHeader: string,
    @Body() notizDto: CreateNotizDto,
  ) {
    this.logger.log('Creating new notiz', { notizDto });
    const bearbeiterId = extractBearbeiterId(bearbeiterHeader);
    const einsatzId = extractEinsatzId(einsatzHeader);
    return this.notizenService.createNotiz({
      einsatzId,
      bearbeiterId,
      notizDto,
    });
  }

  @Put(':notizId')
  async updateNotiz(
    @Param('notizId') notizId: string,
    @Headers('einsatz') einsatzHeader: string,
    @Headers('bearbeiter') bearbeiterHeader: string,
    @Body() notizDto: UpdateNotizDto,
  ) {
    this.logger.log('Update notiz', { notizDto, notizId });
    const bearbeiterId = extractBearbeiterId(bearbeiterHeader);
    const einsatzId = extractEinsatzId(einsatzHeader);
    return await this.notizenService.updateNotiz({
      bearbeiterId,
      einsatzId,
      notizDto,
      notizId,
    });
  }

  @Delete(':notizId')
  deleteNotiz(
    @Param('notizId') notizId: string,
    @Headers('einsatz') einsatzHeader: string,
    @Headers('bearbeiter') bearbeiterHeader: string,
  ) {
    const bearbeiterId = extractBearbeiterId(bearbeiterHeader);
    const einsatzId = extractEinsatzId(einsatzHeader);
    return this.notizenService.deleteNotiz(notizId, einsatzId, bearbeiterId);
  }

  @Post(':notizId/toggle-complete')
  completeNotiz(
    @Param('notizId') notizId: string,
    @Headers('einsatz') einsatzHeader: string,
    @Headers('bearbeiter') bearbeiterHeader: string,
  ) {
    const bearbeiterId = extractBearbeiterId(bearbeiterHeader);
    const einsatzId = extractEinsatzId(einsatzHeader);
    return this.notizenService.toggleCompleteNotiz(
      notizId,
      einsatzId,
      bearbeiterId,
    );
  }
}
