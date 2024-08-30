import {
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { extractBearbeiterId, extractEinsatzId } from '../utils/header.utils';

@Controller('reminders')
export class RemindersController {
  private readonly logger = new Logger(RemindersController.name);

  constructor(private readonly reminderService: RemindersService) {}

  @Post()
  async createReminder(
    @Headers('einsatz') einsatzHeader: string,
    @Headers('bearbeiter') bearbeiterHeader: string,
    @Body() data: { noteId: string; reminderTime: string },
  ) {
    this.logger.log(`Creating reminder for ${einsatzHeader}`);
    const bearbeiterId = extractBearbeiterId(bearbeiterHeader);
    const einsatzId = extractEinsatzId(einsatzHeader);
    const reminderTime = new Date(data.reminderTime);
    return this.reminderService.create(
      data.noteId,
      reminderTime,
      einsatzId,
      bearbeiterId,
    );
  }

  @Get('due')
  async getDueReminders(
    @Headers('einsatz') einsatzHeader: string,
    @Headers('bearbeiter') bearbeiterHeader: string,
  ) {
    const bearbeiterId = extractBearbeiterId(bearbeiterHeader);
    const einsatzId = extractEinsatzId(einsatzHeader);
    return this.reminderService.getDueReminders(bearbeiterId, einsatzId);
  }

  @Post(':reminderId/mark-notified')
  async markAsNotified(
    @Headers('einsatz') einsatzHeader: string,
    @Headers('bearbeiter') bearbeiterHeader: string,
    @Param('reminderId') reminderId: string,
  ) {
    this.logger.log(`Mark reminder as notified ${reminderId}`);
    const bearbeiterId = extractBearbeiterId(bearbeiterHeader);
    const einsatzId = extractEinsatzId(einsatzHeader);
    await this.reminderService.markAsNotified(
      reminderId,
      einsatzId,
      bearbeiterId,
    );
  }

  @Post(':remindersId/mark-read')
  async markAsRead(
    @Headers('einsatz') einsatzHeader: string,
    @Headers('bearbeiter') bearbeiterHeader: string,
    @Param('reminderId') reminderId: string,
  ) {
    const bearbeiterId = extractBearbeiterId(bearbeiterHeader);
    const einsatzId = extractEinsatzId(einsatzHeader);
    await this.reminderService.markAsRead(reminderId, einsatzId, bearbeiterId);
  }
}
