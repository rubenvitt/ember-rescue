import { Module } from '@nestjs/common';
import { NotizenController } from './notizen.controller';
import { NotizenService } from './notizen.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notiz,
  NotizSchema,
} from '@core/database/mongo/schemas/einsatz/notiz.schema';
import { NotizenRepository } from './notizen.repository';

@Module({
  controllers: [NotizenController],
  providers: [NotizenService, NotizenRepository],
  imports: [
    MongooseModule.forFeature([{ name: Notiz.name, schema: NotizSchema }]),
  ],
})
export class NotizenModule {}
