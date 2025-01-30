import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Reminder, ReminderSchema } from './reminder.schema';
import { RemindersRepository } from './reminders.repository';

@Module({
  providers: [RemindersService, RemindersRepository],
  controllers: [RemindersController],
  imports: [
    MongooseModule.forFeature([
      { name: Reminder.name, schema: ReminderSchema },
    ]),
  ],
})
export class RemindersModule {}
