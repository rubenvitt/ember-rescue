import { Module } from '@nestjs/common';
import { ExportModule } from './export/export.module';
import { MapModule } from './map/map.module';
import { NinaModule } from './nina/nina.module';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [ExportModule, MapModule, NinaModule, PdfModule],
})
export class FeaturesModule {}
