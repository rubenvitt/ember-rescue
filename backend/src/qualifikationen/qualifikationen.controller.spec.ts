import { Test, TestingModule } from '@nestjs/testing';
import { QualifikationenController } from './qualifikationen.controller';
import { QualifikationenService } from './qualifikationen.service';
import { QualifikationDto } from '../types';

describe('QualifikationenController', () => {
  let controller: QualifikationenController;
  let service: QualifikationenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QualifikationenController],
      providers: [
        {
          provide: QualifikationenService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<QualifikationenController>(
      QualifikationenController,
    );
    service = module.get<QualifikationenService>(QualifikationenService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of qualifications', async () => {
      const mockQualifications: QualifikationDto[] = [
        { id: '1', bezeichnung: 'Qualification 1', abkuerzung: 'Q1' },
        { id: '2', bezeichnung: 'Qualification 2', abkuerzung: 'Q2' },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockQualifications);

      const result = await controller.findAll();
      expect(result).toEqual(mockQualifications);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
