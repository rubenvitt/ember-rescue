import { Reminder } from '@core/database/mongo/schemas/einsatz/reminder.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  AnyKeys,
  Model,
  ProjectionType,
  RootFilterQuery,
  UpdateQuery,
} from 'mongoose';

export class RemindersRepository {
  constructor(
    @InjectModel(Reminder.name) private readonly model: Model<Reminder>,
  ) {}

  create(data: AnyKeys<Reminder>) {
    return this.model.create(data);
  }

  find(
    filter: RootFilterQuery<Reminder>,
    projection: ProjectionType<Reminder>,
  ) {
    return this.model.find(filter, projection).exec();
  }

  updateOne(filter: RootFilterQuery<Reminder>, query: UpdateQuery<Reminder>) {
    return this.model.updateOne(filter, query).exec();
  }

  updateMany(filter: RootFilterQuery<Reminder>, query: UpdateQuery<Reminder>) {
    return this.model.updateMany(filter, query).exec();
  }
}
