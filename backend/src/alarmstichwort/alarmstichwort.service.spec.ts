import { Test, TestingModule } from '@nestjs/testing';
import { AlarmstichwortService } from './alarmstichwort.service';
import { PrismaService } from '../database/prisma/prisma.service';

describe('AlarmstichwortService', () => {
  let service: AlarmstichwortService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlarmstichwortService,
        {
          provide: PrismaService,
          useValue: {
            alarmstichwort: {
              findMany: jest.fn().mockResolvedValue(['ALARM1', 'ALARM2']),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AlarmstichwortService>(AlarmstichwortService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of alarm keywords', async () => {
      const result = await service.findAll();
      expect(result).toEqual(['ALARM1', 'ALARM2']);
      expect(prismaService.alarmstichwort.findMany).toHaveBeenCalled();
    });
  });
});
