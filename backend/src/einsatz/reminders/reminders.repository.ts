import { Reminder } from './reminder.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '@core/database/repositories/base.repository';

export class RemindersRepository extends BaseRepository<Reminder> {
  constructor(@InjectModel(Reminder.name) readonly model: Model<Reminder>) {
    super(model, RemindersRepository.name);
  }
}
