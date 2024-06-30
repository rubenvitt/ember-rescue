import { Module } from '@nestjs/common';
import { QualifikationenController } from './qualifikationen.controller';
import { QualifikationenService } from './qualifikationen.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [QualifikationenController],
  providers: [QualifikationenService],
  imports: [DatabaseModule],
})
export class QualifikationenModule {}
