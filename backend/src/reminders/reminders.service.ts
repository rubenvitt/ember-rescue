import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class RemindersService {
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
}
