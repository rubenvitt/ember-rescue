import { Injectable } from '@nestjs/common';
import { Template } from '@pdfme/common';
import { PdfService } from '../pdf/pdf.service';
import { EinsatzService } from '../einsatz/einsatz.service';
import { EinsatztagebuchService } from '../einsatztagebuch/einsatztagebuch.service';
import { formatNatoDateTime } from '../utils/time';

@Injectable()
export class ExportService {
  private readonly pdfTemplate: Template = {
    schemas: [
      {
        stichwort_date: {
          type: 'multiVariableText',
          position: { x: 5.03, y: 4.04 },
          required: true,
          content: '{"stichwort":"B2Y","datetime":"121010Jul24"}',
          width: 93.42,
          height: 10,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 13,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          strikethrough: false,
          underline: false,
          text: '{stichwort} - {datetime}',
          variables: ['stichwort', 'datetime'],
          fontName: 'NotoSerifJP-Regular',
        },
        heading: {
          type: 'readOnlyText',
          content: 'Export Einsatztagebuch',
          position: { x: 4.76, y: 13.95 },
          width: 197.66,
          height: 10,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 24,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          strikethrough: false,
          underline: false,
          readOnly: true,
          required: false,
          fontName: 'NotoSerifJP-Regular',
        },
        etbTable: {
          type: 'table',
          position: { x: 3.17, y: 29.89 },
          width: 201.06,
          height: 36.696,
          content: '[["301250Jul24","40-12-1","40-12-1","Row 1"]]',
          showHead: true,
          head: ['Timestamp', 'Absender', 'Empfänger', 'Nachricht'],
          headWidthPercentages: [
            13.685118869989052, 11.187754899035118, 12.687754899035115,
            62.43937133194072,
          ],
          tableStyles: { borderWidth: 0, borderColor: '#000000' },
          headStyles: {
            fontName: 'NotoSerifJP-Regular',
            fontSize: 10,
            characterSpacing: 0,
            alignment: 'left',
            verticalAlignment: 'middle',
            lineHeight: 1,
            fontColor: '#ffffff',
            borderColor: '#333333',
            backgroundColor: '#da0000',
            borderWidth: { top: 0, right: 0, bottom: 0, left: 0 },
            padding: { top: 2, right: 2, bottom: 2, left: 2 },
          },
          bodyStyles: {
            fontName: 'NotoSerifJP-Regular',
            fontSize: 10,
            characterSpacing: 0,
            alignment: 'left',
            verticalAlignment: 'middle',
            lineHeight: 1,
            fontColor: '#000000',
            borderColor: '#333333',
            backgroundColor: '',
            alternateBackgroundColor: '#f5f5f5',
            borderWidth: { top: 0.1, right: 0.1, bottom: 0.1, left: 0.1 },
            padding: { top: 2, right: 2, bottom: 2, left: 2 },
          },
          columnStyles: {},
          required: false,
        },
      },
    ],
    basePdf: { width: 210, height: 297, padding: [0, 0, 0, 0] },
    pdfmeVersion: '4.0.0',
  };

  constructor(
    private readonly pdfService: PdfService,
    private readonly einsatzService: EinsatzService,
    private readonly einsatzTagebuchService: EinsatztagebuchService,
  ) {}

  async generateExportPdf(einsatzId: string) {
    const einsatz = await this.einsatzService.getEinsatz(einsatzId);

    const etb = await this.einsatzTagebuchService.getEinsatztagebuch(einsatzId);

    const input = [
      {
        stichwort_date: JSON.stringify({
          stichwort: einsatz.einsatz_alarmstichwort.bezeichnung,
          datetime: formatNatoDateTime(einsatz.beginn),
        }),
        etbTable: JSON.stringify(
          etb.map((entry) => [
            formatNatoDateTime(entry.timestamp),
            entry.absender,
            entry.empfaenger,
            entry.content,
          ]),
        ),
      },
    ];

    return this.pdfService.generate(this.pdfTemplate, input);
  }
}
