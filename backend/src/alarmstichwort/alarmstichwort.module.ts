import { Module } from '@nestjs/common';
import { AlarmstichwortController } from './alarmstichwortController';
import { AlarmstichwortService } from './alarmstichwort.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [AlarmstichwortController],
  providers: [AlarmstichwortService],
  imports: [DatabaseModule],
})
export class AlarmstichwortModule {}
