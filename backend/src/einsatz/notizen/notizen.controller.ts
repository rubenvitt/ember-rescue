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
  UseGuards,
} from '@nestjs/common';
import { NotizenService } from './notizen.service';
import { extractEinsatzId } from '../../utils/header.utils';
import { BearbeiterDto, CreateNotizDto, UpdateNotizDto } from '../../types';
import { CurrentBearbeiter } from '../../user/bearbeiter/core/bearbeiter.decorator';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';

@Controller(`notizen`)
@UseGuards(BearbeiterGuard)
export class NotizenController {
  private readonly logger = new Logger(NotizenController.name);

  constructor(private readonly notizenService: NotizenService) {}

  @Get()
  getNotizen(
    @Headers('einsatz') einsatzHeader: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Query('done') done: boolean = false,
  ) {
    const einsatzId = extractEinsatzId(einsatzHeader)!!;
    return this.notizenService.findAllNotizen(einsatzId, bearbeiter.name, done);
  }

  @Post()
  createNotiz(
    @Headers('einsatz') einsatzHeader: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Body() notizDto: CreateNotizDto,
  ) {
    this.logger.log('Creating new notiz', { notizDto });
    const einsatzId = extractEinsatzId(einsatzHeader)!!;
    return this.notizenService.createNotiz({
      einsatzId,
      bearbeiterId: bearbeiter.name,
      notizDto,
    });
  }

  @Put(':notizId')
  async updateNotiz(
    @Param('notizId') notizId: string,
    @Headers('einsatz') einsatzHeader: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Body() notizDto: UpdateNotizDto,
  ) {
    this.logger.log('Update notiz', { notizDto, notizId });
    const einsatzId = extractEinsatzId(einsatzHeader)!!;
    return await this.notizenService.updateNotiz({
      bearbeiterId: bearbeiter.name,
      einsatzId,
      notizDto,
      notizId,
    });
  }

  @Delete(':notizId')
  deleteNotiz(
    @Param('notizId') notizId: string,
    @Headers('einsatz') einsatzHeader: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
  ) {
    const einsatzId = extractEinsatzId(einsatzHeader)!!;
    return this.notizenService.deleteNotiz(notizId, einsatzId, bearbeiter.name);
  }

  @Post(':notizId/toggle-complete')
  completeNotiz(
    @Param('notizId') notizId: string,
    @Headers('einsatz') einsatzHeader: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
  ) {
    const einsatzId = extractEinsatzId(einsatzHeader)!!;
    return this.notizenService.toggleCompleteNotiz(
      notizId,
      einsatzId,
      bearbeiter.name,
    );
  }
}
