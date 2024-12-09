import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotizenService } from './notizen.service';
import { BearbeiterDto } from '../../types';
import { CurrentBearbeiter } from '../../user/bearbeiter/core/bearbeiter.decorator';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';
import { ApiBody, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateNotizDto, ManyNoteResponse, OneNoteResponse } from './notes.dto';

@Controller(`/missions/:missionId/notes`)
@UseGuards(BearbeiterGuard)
export class NotizenController {
  private readonly logger = new Logger(NotizenController.name);

  constructor(private readonly notizenService: NotizenService) {}

  @Get()
  @ApiOkResponse({
    type: ManyNoteResponse,
    description: 'Get all notizen for mission',
  })
  @ApiQuery({
    name: 'done',
    required: false,
    type: Boolean,
    description: 'Get only done notizen',
    default: false,
  })
  @ApiParam({
    name: 'missionId',
    required: true,
    type: String,
    description: 'Mission ID',
  })
  getNotizen(
    @Param('missionId') einsatzId: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Query('done') done: boolean = false,
  ) {
    return this.notizenService.findAllNotizen(einsatzId, bearbeiter.name, done);
  }

  @Post()
  @ApiOkResponse({
    description: 'Create new notiz',
    type: OneNoteResponse,
  })
  @ApiParam({
    name: 'missionId',
    required: true,
    type: String,
    description: 'Mission ID',
  })
  @ApiBody({
    type: CreateNotizDto,
    description: 'Notiz data',
  })
  createNotiz(
    @Param('missionId') einsatzId: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Body() notizDto: CreateNotizDto,
  ) {
    this.logger.log('Creating new notiz', { notizDto });
    return this.notizenService.createNotiz({
      einsatzId,
      bearbeiterName: bearbeiter.name,
      notizDto,
    });
  }

  @Put(':notizId')
  @ApiOkResponse({
    description: 'Update notiz',
  })
  @ApiParam({
    name: 'notizId',
    required: true,
    type: String,
    description: 'Notiz ID',
  })
  @ApiParam({
    name: 'missionId',
    required: true,
    type: String,
    description: 'Mission ID',
  })
  @ApiBody({
    type: CreateNotizDto,
    description: 'Notiz data',
  })
  async updateNotiz(
    @Param('notizId') notizId: string,
    @Param('missionId') einsatzId: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Body() notizDto: CreateNotizDto,
  ) {
    this.logger.log('Update notiz', { notizDto, notizId });
    return await this.notizenService.updateNotiz({
      bearbeiterName: bearbeiter.name,
      einsatzId,
      notizDto,
      notizId,
    });
  }

  @Delete(':notizId')
  @ApiOkResponse({
    description: 'Delete notiz',
  })
  @ApiParam({
    name: 'notizId',
    required: true,
    type: String,
    description: 'Notiz ID',
  })
  @ApiParam({
    name: 'missionId',
    required: true,
    type: String,
    description: 'Mission ID',
  })
  deleteNotiz(
    @Param('notizId') notizId: string,
    @Param('missionId') einsatzId: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
  ) {
    return this.notizenService.deleteNotiz(notizId, einsatzId, bearbeiter.name);
  }

  @Post(':notizId/toggle-complete')
  @ApiOkResponse({
    description: 'Toggle notiz complete',
  })
  @ApiParam({
    name: 'notizId',
    required: true,
    type: String,
    description: 'Notiz ID',
  })
  @ApiParam({
    name: 'missionId',
    required: true,
    type: String,
  })
  completeNotiz(
    @Param('notizId') notizId: string,
    @Param('missionId') einsatzId: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
  ) {
    return this.notizenService.toggleCompleteNotiz(
      notizId,
      einsatzId,
      bearbeiter.name,
    );
  }
}
