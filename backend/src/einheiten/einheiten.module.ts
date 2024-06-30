import { Module } from '@nestjs/common';
import { EinheitenController } from './einheiten.controller';
import { EinheitenService } from './einheiten.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [EinheitenController],
  providers: [EinheitenService],
  imports: [DatabaseModule],
})
export class EinheitenModule {}
