import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { subDays, subMinutes } from 'date-fns';
import { InjectModel } from '@nestjs/mongoose';
import { Reminder } from '../database/mongo/schemas/einsatz/reminder.schema';
import { Model } from 'mongoose';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    @InjectModel(Reminder.name) private readonly reminderModel: Model<Reminder>,
  ) {}

  async create(
    note: string,
    reminderTime: Date,
    einsatzId: string,
    bearbeiterId: string,
  ) {
    return this.reminderModel.create({
      timestamp: reminderTime,
      title: note,
    });
  }

  async getDueReminders(bearbeiterId: string, einsatzId: string) {
    const now = new Date();

    return this.reminderModel
      .find(
        {
          reminderTimestamp: {
            lt: now,
          },
          notified: null,
          bearbeiterId,
          einsatzId,
        },
        {},
      )
      .exec();
  }

  async markAsNotified(id: string, einsatzId?: string, bearbeiterId?: string) {
    return this.reminderModel.updateOne(
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
    return this.reminderModel.updateOne(
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

    await this.reminderModel.updateMany(
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
