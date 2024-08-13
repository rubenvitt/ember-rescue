import { Module } from '@nestjs/common';
import { NotizenController } from './notizen.controller';
import { NotizenService } from './notizen.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [NotizenController],
  providers: [NotizenService],
  imports: [DatabaseModule],
})
export class NotizenModule {}
