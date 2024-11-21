import {
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { extractEinsatzId } from '../../utils/header.utils';
import { CurrentBearbeiter } from '../../user/bearbeiter/core/bearbeiter.decorator';
import { BearbeiterDto } from '../../types';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';

@Controller('reminders')
@UseGuards(BearbeiterGuard)
export class RemindersController {
  private readonly logger = new Logger(RemindersController.name);

  constructor(private readonly reminderService: RemindersService) {}

  @Post()
  async createReminder(
    @Headers('einsatz') einsatzHeader: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Body() data: { noteId: string; reminderTime: string },
  ) {
    this.logger.log(`Creating reminder for ${einsatzHeader}`);
    const einsatzId = extractEinsatzId(einsatzHeader)!!;
    const reminderTime = new Date(data.reminderTime);
    return this.reminderService.create(
      data.noteId,
      reminderTime,
      einsatzId,
      bearbeiter.name,
    );
  }

  @Get('due')
  async getDueReminders(
    @Headers('einsatz') einsatzHeader: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
  ) {
    const einsatzId = extractEinsatzId(einsatzHeader)!!;
    return this.reminderService.getDueReminders(bearbeiter.name, einsatzId);
  }

  @Post(':reminderId/mark-notified')
  async markAsNotified(
    @Headers('einsatz') einsatzHeader: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Param('reminderId') reminderId: string,
  ) {
    this.logger.log(`Mark reminder as notified ${reminderId}`);
    const einsatzId = extractEinsatzId(einsatzHeader)!!;
    await this.reminderService.markAsNotified(
      reminderId,
      einsatzId,
      bearbeiter.name,
    );
  }

  @Post(':remindersId/mark-read')
  async markAsRead(
    @Headers('einsatz') einsatzHeader: string,
    @CurrentBearbeiter() bearbeiter: BearbeiterDto,
    @Param('reminderId') reminderId: string,
  ) {
    const einsatzId = extractEinsatzId(einsatzHeader)!!;
    await this.reminderService.markAsRead(
      reminderId,
      einsatzId,
      bearbeiter.name,
    );
  }
}
