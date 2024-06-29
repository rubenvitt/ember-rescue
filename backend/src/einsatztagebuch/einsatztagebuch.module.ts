import { Module } from '@nestjs/common';
import { EinsatztagebuchController } from './einsatztagebuch.controller';
import { EinsatztagebuchService } from './einsatztagebuch.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [EinsatztagebuchController],
  providers: [EinsatztagebuchService],
})
export class EinsatztagebuchModule {}
