import { Test, TestingModule } from '@nestjs/testing';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { extractEinsatzId } from '../utils/header.utils';
import { Response } from 'express';

// Mock für den Response
const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.set = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock('../utils/header.utils');

describe('ExportController', () => {
  let controller: ExportController;
  let exportService: ExportService;
  let res: Partial<Response>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportController],
      providers: [
        {
          provide: ExportService,
          useValue: {
            generateExportPdf: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ExportController>(ExportController);
    exportService = module.get<ExportService>(ExportService);
    res = mockResponse();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createExportPdf', () => {
    it('should call extractEinsatzId and generateExportPdf, and set the response headers and body', async () => {
      const einsatzId = 'test-einsatz-id';
      const einsatzHeader = 'some-header';
      const pdfBuffer = Buffer.from('PDF content');

      (extractEinsatzId as jest.Mock).mockReturnValue(einsatzId);
      (exportService.generateExportPdf as jest.Mock).mockResolvedValue(
        pdfBuffer,
      );

      await controller.createExportPdf(res as Response, einsatzHeader);

      expect(extractEinsatzId).toHaveBeenCalledWith(einsatzHeader);
      expect(exportService.generateExportPdf).toHaveBeenCalledWith(einsatzId);
      expect(res.set).toHaveBeenCalledWith(
        expect.objectContaining({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=export.pdf',
        }),
      );
      expect(res.send).toHaveBeenCalledWith(pdfBuffer);
    });

    it('should handle errors and send a 500 status', async () => {
      const einsatzHeader = 'some-header';

      (extractEinsatzId as jest.Mock).mockReturnValue('test-einsatz-id');
      (exportService.generateExportPdf as jest.Mock).mockRejectedValue(
        new Error('Error'),
      );

      await controller.createExportPdf(res as Response, einsatzHeader);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error generating PDF');
    });
  });
});
