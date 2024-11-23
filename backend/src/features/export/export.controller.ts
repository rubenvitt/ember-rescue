import { Controller, Get, Headers, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ExportService } from './export.service';
import { extractEinsatzId } from '../../utils/header.utils';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';

@Controller('features/export')
@UseGuards(BearbeiterGuard)
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('/pdf')
  async createExportPdf(
    @Res() res: Response,
    @Headers('einsatz') einsatzHeader: string,
  ) {
    const einsatzId = extractEinsatzId(einsatzHeader)!!;
    try {
      const pdf = await this.exportService.generateExportPdf(einsatzId);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=export.pdf',
      });

      res.send(Buffer.from(pdf!!));
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Error generating PDF');
    }
  }
}
