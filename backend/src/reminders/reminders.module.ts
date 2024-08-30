import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  providers: [RemindersService],
  controllers: [RemindersController],
  imports: [DatabaseModule],
})
export class RemindersModule {}
