import { Module } from '@nestjs/common';
import { FahrzeugeController } from './fahrzeuge.controller';
import { FahrzeugeService } from './fahrzeuge.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [FahrzeugeController],
  providers: [FahrzeugeService],
  imports: [DatabaseModule],
  exports: [FahrzeugeService],
})
export class FahrzeugeModule {}
