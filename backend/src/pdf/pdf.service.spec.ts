import { Test, TestingModule } from '@nestjs/testing';
import { PdfService } from './pdf.service';
import { Template } from '@pdfme/common';
import { generate } from '@pdfme/generator';
import { multiVariableText, readOnlyText, tableBeta } from '@pdfme/schemas';

jest.mock('@pdfme/generator');

describe('PdfService', () => {
  let service: PdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfService],
    }).compile();

    service = module.get<PdfService>(PdfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generate', () => {
    it('should correctly call the generate function with provided template and inputs', async () => {
      const template: Template = {
        schemas: [],
        basePdf: '',
      };

      const inputs = [{ test: 'value' }];

      const resultBuffer = Buffer.from(
        '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/MediaBox [0 0 612 792]\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/BaseFont /Helvetica\n/Subtype /Type1\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\n0000000176 00000 n\n0000000301 00000 n\ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n365\n%%EOF',
      );

      (generate as jest.Mock).mockResolvedValue(resultBuffer);

      const result = await service.generate(template, inputs);

      expect(generate).toHaveBeenCalledWith({
        template,
        inputs,
        plugins: {
          multiVariableText,
          readOnlyText,
          tableBeta,
        },
      });

      // Überprüfen, dass der Resultierende Buffer kein leeres PDF ist
      expect(result.length).toBeGreaterThan(0);
      // Überprüfen, ob das PDF mit %PDF beginnt
      expect(result.slice(0, 4).toString()).toBe('%PDF');
    });

    it('should throw an error if generate fails', async () => {
      const template: Template = {
        schemas: [],
        basePdf: '',
      };

      const inputs = [{ test: 'value' }];

      const errorMessage = 'Generation failed';

      (generate as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(service.generate(template, inputs)).rejects.toThrow(
        errorMessage,
      );
    });
  });
});
