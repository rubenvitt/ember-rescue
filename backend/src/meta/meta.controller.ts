import { Controller, Get, Logger, Res } from '@nestjs/common';
import { MetaService } from './meta.service';
import { generate } from '@pdfme/generator';
import { Response } from 'express';
import { Template } from '@pdfme/common';
import { multiVariableText, readOnlyText, tableBeta } from '@pdfme/schemas';

const template: Template = {
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
      field3: {
        type: 'table',
        position: { x: 0, y: 29.36 },
        width: 150,
        height: 57.5184,
        content:
          '[["Alice","New York","Alice is a freelance web designer and developer"],["Bob","Paris","Bob is a freelance illustrator and graphic designer"]]',
        showHead: true,
        head: ['Name', 'City', 'Description'],
        headWidthPercentages: [30, 30, 40],
        tableStyles: { borderColor: '#000000', borderWidth: 0.3 },
        headStyles: {
          alignment: 'left',
          verticalAlignment: 'middle',
          fontSize: 13,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#ffffff',
          backgroundColor: '#2980ba',
          borderColor: '',
          borderWidth: { top: 0, right: 0, bottom: 0, left: 0 },
          padding: { top: 5, bottom: 5, left: 5, right: 5 },
        },
        bodyStyles: {
          alignment: 'left',
          verticalAlignment: 'middle',
          fontSize: 13,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          borderColor: '#888888',
          borderWidth: { top: 0.1, bottom: 0.1, left: 0.1, right: 0.1 },
          padding: { top: 5, bottom: 5, left: 5, right: 5 },
          alternateBackgroundColor: '#f5f5f5',
        },
        columnStyles: {},
        required: false,
      },
    },
  ],
  basePdf: { width: 210, height: 297, padding: [0, 0, 0, 0] },
  pdfmeVersion: '4.0.0',
};

@Controller('meta')
export class MetaController {
  private readonly logger = new Logger(MetaController.name);

  constructor(private readonly metaService: MetaService) {}

  @Get()
  getMeta() {
    return this.metaService.findAppMetadata();
  }

  @Get('/test')
  async getTest(@Res() res: Response) {
    const inputs = [
      {
        stichwort_date: `{"stichwort":"XXX","datetime":"natodatetime-converted"}`,
        field3:
          '[["Martina","Hamburg","Martina is a freelance web designer and developer"]]',
      },
    ];

    try {
      const pdf = await generate({
        // @ts-ignore
        template,
        inputs,
        // @ts-ignore
        plugins: {
          multiVariableText,
          readOnlyText,
          tableBeta,
        },
      });

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=generated.pdf',
      });

      res.send(Buffer.from(pdf));
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Error generating PDF');
    }
  }
}
