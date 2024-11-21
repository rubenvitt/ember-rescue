import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { subDays, subMinutes } from 'date-fns';
import { RemindersRepository } from './reminders.repository';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(private readonly repository: RemindersRepository) {}

  // FIXME
  async create(
    note: string,
    reminderTime: Date,
    einsatzId: string,
    bearbeiterId: string,
  ) {
    return this.repository.create({
      timestamp: reminderTime,
      title: note,
    });
  }

  async getDueReminders(bearbeiterId: string, einsatzId: string) {
    const now = new Date();

    return this.repository.find(
      {
        reminderTimestamp: {
          lt: now,
        },
        notified: null,
        bearbeiterId,
        einsatzId,
      },
      {},
    );
  }

  async markAsNotified(id: string, einsatzId?: string, bearbeiterId?: string) {
    return this.repository.updateOne(
      {
        _id: id,
        einsatzId,
        bearbeiterId,
      },
      {
        $set: {
          notified: new Date(),
        },
      },
    );
  }

  async markAsRead(id: string, einsatzId: string, bearbeiterId: string) {
    return this.repository.updateOne(
      {
        _id: id,
        einsatzId,
        bearbeiterId,
      },
      {
        $set: {
          read: new Date(),
        },
      },
    );
  }

  @Cron('0 10 * * * *')
  async cleanup() {
    this.logger.log('Reminders cleanup');

    await this.repository.updateMany(
      {
        $or: [
          {
            read: {
              $lt: subMinutes(new Date(), 30),
            },
          },
          {
            notified: {
              $lt: subDays(new Date(), 1),
            },
          },
          {
            'einsatz.abgeschlossen': {
              $exists: false,
            },
          },
        ],
      },
      {
        $set: {
          read: new Date(),
        },
      },
    );
  }
}
