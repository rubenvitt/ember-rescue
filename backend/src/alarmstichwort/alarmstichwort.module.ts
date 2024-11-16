import { Module } from '@nestjs/common';
import { AlarmstichwortController } from './alarmstichwortController';
import { AlarmstichwortService } from './alarmstichwort.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Alarmstichwort,
  AlarmstichwortSchema,
} from '../core/database/mongo/schemas/alarmstichwort.schema';

@Module({
  controllers: [AlarmstichwortController],
  providers: [AlarmstichwortService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Alarmstichwort.name,
        schema: AlarmstichwortSchema,
      },
    ]),
  ],
  exports: [AlarmstichwortService],
})
export class AlarmstichwortModule {}
