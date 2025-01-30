import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CurrentBearbeiter } from '../../user/bearbeiter/core/bearbeiter.decorator';
import { BearbeiterDto } from '../../types';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import {
  CreateReminderDto,
  ManyReminderResponse,
  OneReminderResponse,
} from './reminders.dto';

@Controller('missions/:missionId/reminders')
@UseGuards(BearbeiterGuard)
export class RemindersController {
  private readonly logger = new Logger(RemindersController.name);

  constructor(private readonly reminderService: RemindersService) {}

  @Get('due')
  @ApiOkResponse({
    type: ManyReminderResponse,
  })
  async getDueReminders(
    @Param('missionId') einsatzId: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
  ) {
    return this.reminderService.getDueReminders(bearbeiter.name, einsatzId);
  }

  @Post()
  @ApiBody({
    type: CreateReminderDto,
  })
  @ApiOkResponse({
    type: OneReminderResponse,
  })
  async createReminder(
    @Param('missionId') einsatzId: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Body() data: { noteId: string; reminderTime: string },
  ) {
    const reminderTime = new Date(data.reminderTime);
    return this.reminderService.create(
      data.noteId,
      reminderTime,
      einsatzId,
      bearbeiter.name,
    );
  }

  @Post(':reminderId/mark-notified')
  async markAsNotified(
    @Param('missionId') einsatzId: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Param('reminderId') reminderId: string,
  ) {
    await this.reminderService.markAsNotified(
      reminderId,
      einsatzId,
      bearbeiter.name,
    );
  }

  @Post(':remindersId/mark-read')
  async markAsRead(
    @Param('missionId') einsatzId: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Param('remindersId') reminderId: string,
  ) {
    await this.reminderService.markAsRead(
      reminderId,
      einsatzId,
      bearbeiter.name,
    );
  }
}
