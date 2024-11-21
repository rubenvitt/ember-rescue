import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { PdfModule } from '../pdf/pdf.module';
import { EinsatztagebuchModule } from '../einsatz/einsatztagebuch/einsatztagebuch.module';
import { EinsatzModule } from '../einsatz/einsatz.module';

@Module({
  providers: [ExportService],
  controllers: [ExportController],
  imports: [PdfModule, EinsatzModule, EinsatztagebuchModule],
})
export class ExportModule {}
