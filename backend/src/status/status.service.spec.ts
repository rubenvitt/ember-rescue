import { Test, TestingModule } from '@nestjs/testing';
import { StatusService } from './status.service';
import { PrismaService } from '../database/prisma/prisma.service';

describe('StatusService', () => {
  let service: StatusService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      status: {
        findMany: jest.fn().mockResolvedValue([{ id: '1', status: 'ok' }]),
        findUnique: jest.fn().mockImplementation(({ where: { code, id } }) => {
          if (code) {
            return { id: '1', code, status: 'ok' };
          }
          if (id) {
            return { id, code: '200', status: 'ok' };
          }
          return null;
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatusService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<StatusService>(StatusService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all statuses', async () => {
      const result = await service.findAll();
      expect(result).toEqual([{ id: '1', status: 'ok' }]);
      expect(prismaService.status.findMany).toHaveBeenCalled();
    });
  });

  describe('findStatusByCode', () => {
    it('should return status by code', async () => {
      const code = 200;
      const result = await service.findStatusByCode(code);
      expect(result).toEqual({ id: '1', code: String(code), status: 'ok' });
      expect(prismaService.status.findUnique).toHaveBeenCalledWith({
        where: {
          code: String(code),
        },
      });
    });
  });

  describe('findStatusById', () => {
    it('should return status by id', async () => {
      const id = '1';
      const result = await service.findStatusById(id);
      expect(result).toEqual({ id, code: '200', status: 'ok' });
      expect(prismaService.status.findUnique).toHaveBeenCalledWith({
        where: {
          id,
        },
      });
    });
  });
});
