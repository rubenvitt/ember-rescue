import { Test, TestingModule } from '@nestjs/testing';
import { ExportService } from './export.service';
import { PdfService } from '../pdf/pdf.service';
import { EinsatzService } from '../einsatz/einsatz.service';
import { EinsatztagebuchService } from '../einsatztagebuch/einsatztagebuch.service';

describe('ExportService', () => {
  let service: ExportService;
  let pdfService: PdfService;
  let einsatzService: EinsatzService;
  let einsatzTagebuchService: EinsatztagebuchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExportService,
        {
          provide: PdfService,
          useValue: {
            generate: jest.fn(),
          },
        },
        {
          provide: EinsatzService,
          useValue: {
            getEinsatz: jest.fn(),
          },
        },
        {
          provide: EinsatztagebuchService,
          useValue: {
            getEinsatztagebuch: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExportService>(ExportService);
    pdfService = module.get<PdfService>(PdfService);
    einsatzService = module.get<EinsatzService>(EinsatzService);
    einsatzTagebuchService = module.get<EinsatztagebuchService>(
      EinsatztagebuchService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateExportPdf', () => {
    it('should handle error if getEinsatz throws an exception', async () => {
      const einsatzId = 'invalid-einsatz-id';

      jest
        .spyOn(einsatzService, 'getEinsatz')
        .mockRejectedValue(new Error('Einsatz data not found'));

      await expect(service.generateExportPdf(einsatzId)).rejects.toThrow(
        'Einsatz data not found',
      );

      expect(einsatzService.getEinsatz).toHaveBeenCalledWith(einsatzId);
    });

    it('should handle empty einsatztagebuch data without throwing an error', async () => {
      const einsatzId = 'test-einsatz-id';
      const einsatz = {
        id: 'test-id',
        einsatz_alarmstichwort: {
          id: 'alarm-id',
          bezeichnung: 'Test Stichwort',
          beschreibung: 'Beschreibung',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        beginn: new Date(),
        ende: new Date(),
        abgeschlossen: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        bearbeiterId: 'bearbeiter-id',
        aufnehmendesRettungsmittelId: 'rettungsmittel-id',
      };
      const einsatztagebuch = [];
      const pdfBuffer = Buffer.from('PDF content');

      jest.spyOn(einsatzService, 'getEinsatz').mockResolvedValue(einsatz);
      jest
        .spyOn(einsatzTagebuchService, 'getEinsatztagebuch')
        .mockResolvedValue(einsatztagebuch);
      jest.spyOn(pdfService, 'generate').mockResolvedValue(pdfBuffer);

      const result = await service.generateExportPdf(einsatzId);

      expect(einsatzService.getEinsatz).toHaveBeenCalledWith(einsatzId);
      expect(einsatzTagebuchService.getEinsatztagebuch).toHaveBeenCalledWith(
        einsatzId,
      );
      expect(pdfService.generate).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
      );
      expect(result).toEqual(pdfBuffer);
    });
  });
});
