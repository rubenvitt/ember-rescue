import { Injectable } from '@nestjs/common';
import { Template } from '@pdfme/common';
import { generate } from '@pdfme/generator';
import { multiVariableText, readOnlyText, tableBeta } from '@pdfme/schemas';

@Injectable()
export class PdfService {
  async generate(template: Template, inputs: Record<string, any>[]) {
    return await generate({
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
  }
}
