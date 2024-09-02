import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { Cron } from '@nestjs/schedule';
import { subDays, subMinutes } from 'date-fns';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    note: string,
    reminderTime: Date,
    einsatzId: string,
    bearbeiterId: string,
  ) {
    return this.prismaService.reminder.create({
      data: {
        noteId: note,
        reminderTimestamp: reminderTime,
        bearbeiterId,
        einsatzId,
      },
    });
  }

  async getDueReminders(bearbeiterId: string, einsatzId: string) {
    const now = new Date();
    return this.prismaService.reminder.findMany({
      where: {
        reminderTimestamp: {
          lt: now,
        },
        notified: null,
        bearbeiterId,
        einsatzId,
      },
    });
  }

  async markAsNotified(id: string, einsatzId?: string, bearbeiterId?: string) {
    return this.prismaService.reminder.update({
      where: { id, bearbeiterId, einsatzId },
      data: {
        notified: new Date(),
      },
    });
  }

  async markAsRead(id: string, einsatzId: string, bearbeiterId: string) {
    return this.prismaService.reminder.update({
      where: { id, einsatzId, bearbeiterId },
      data: {
        read: new Date(),
      },
    });
  }

  @Cron('0 10 * * * *')
  async cleanup() {
    this.logger.log('Reminders cleanup');
    await this.prismaService.reminder.deleteMany({
      where: {
        OR: [
          {
            read: {
              lt: subMinutes(new Date(), 30),
            },
          },
          {
            notified: {
              lt: subDays(new Date(), 1),
            },
          },
          {
            einsatz: {
              abgeschlossen: {
                not: null,
              },
            },
          },
        ],
      },
    });
  }
}
