import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { PdfModule } from '../pdf/pdf.module';
import { MissionsModule } from '../../missions/missions.module';

@Module({
  providers: [ExportService],
  controllers: [ExportController],
  imports: [PdfModule, MissionsModule],
})
export class ExportModule {}
