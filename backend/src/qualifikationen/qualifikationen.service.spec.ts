import { Test, TestingModule } from '@nestjs/testing';
import { QualifikationenService } from './qualifikationen.service';
import { PrismaService } from '../database/prisma/prisma.service';

describe('QualifikationenService', () => {
  let service: QualifikationenService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QualifikationenService,
        {
          provide: PrismaService,
          useValue: {
            qualifikation: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<QualifikationenService>(QualifikationenService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of qualifications', async () => {
      const mockQualifications = [
        {
          id: '1',
          bezeichnung: 'Qualification 1',
          abkuerzung: 'Q1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          bezeichnung: 'Qualification 2',
          abkuerzung: 'Q2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest
        .spyOn(prismaService.qualifikation, 'findMany')
        .mockResolvedValue(mockQualifications);

      const result = await service.findAll();
      expect(result).toEqual(mockQualifications);
      expect(prismaService.qualifikation.findMany).toHaveBeenCalled();
    });
  });
});
