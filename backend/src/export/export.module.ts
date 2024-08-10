import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { PdfModule } from '../pdf/pdf.module';
import { EinsatzModule } from '../einsatz/einsatz.module';
import { EinsatztagebuchModule } from '../einsatztagebuch/einsatztagebuch.module';

@Module({
  providers: [ExportService],
  controllers: [ExportController],
  imports: [PdfModule, EinsatzModule, EinsatztagebuchModule],
})
export class ExportModule {}
