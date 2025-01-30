import { Module } from '@nestjs/common';
import { AlarmstichwortController } from './alarmstichwortController';
import { AlarmstichwortRepository } from './alarmstichwort.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Alarmstichwort,
  AlarmstichwortSchema,
} from '@templates/alarmstichworte/alarmstichwort.schema';

@Module({
  controllers: [AlarmstichwortController],
  providers: [AlarmstichwortRepository],
  imports: [
    MongooseModule.forFeature([
      {
        name: Alarmstichwort.name,
        schema: AlarmstichwortSchema,
      },
    ]),
  ],
  exports: [AlarmstichwortRepository],
})
export class AlarmstichwortModule {}
