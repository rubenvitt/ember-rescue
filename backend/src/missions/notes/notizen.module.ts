import { Module } from '@nestjs/common';
import { NotizenController } from './notizen.controller';
import { NotizenService } from './notizen.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Notiz, NotizSchema } from './notiz.schema';
import { NotizenRepository } from './notizen.repository';
import { BearbeiterCoreModule } from '../../user/bearbeiter/core/bearbeiter-core.module';

@Module({
  controllers: [NotizenController],
  providers: [NotizenService, NotizenRepository],
  imports: [
    MongooseModule.forFeature([{ name: Notiz.name, schema: NotizSchema }]),
    BearbeiterCoreModule,
  ],
})
export class NotizenModule {}
