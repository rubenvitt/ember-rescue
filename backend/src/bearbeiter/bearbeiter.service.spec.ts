import { Test, TestingModule } from '@nestjs/testing';
import { BearbeiterService } from './bearbeiter.service';
import { PrismaService } from '../database/prisma/prisma.service';

describe('BearbeiterService', () => {
  let service: BearbeiterService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const prismaServiceMock = {
      bearbeiter: {
        findMany: jest
          .fn()
          .mockResolvedValue([{ id: '1', name: 'Test User', active: true }]),
        upsert: jest
          .fn()
          .mockResolvedValue({ id: '1', name: 'Test User', active: true }),
        findUnique: jest
          .fn()
          .mockResolvedValue({ id: '1', name: 'Test User', active: true }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BearbeiterService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<BearbeiterService>(BearbeiterService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all active bearbeiters', async () => {
    const result = await service.findAll();
    expect(result).toEqual([{ id: '1', name: 'Test User', active: true }]);
    expect(prismaService.bearbeiter.findMany).toHaveBeenCalledWith({
      where: { active: true },
      select: { name: true, id: true, active: false },
    });
  });

  it('should find or create a bearbeiter by name', async () => {
    const result = await service.findByNameOrCreate('Test User');
    expect(result).toEqual({ id: '1', name: 'Test User', active: true });
    expect(prismaService.bearbeiter.upsert).toHaveBeenCalledWith({
      where: { name: 'Test User' },
      update: { active: true },
      select: { name: true, id: true, active: false },
      create: { name: 'Test User', active: true },
    });
  });

  it('should find a bearbeiter by id', async () => {
    const result = await service.findOne('1');
    expect(result).toEqual({ id: '1', name: 'Test User', active: true });
    expect(prismaService.bearbeiter.findUnique).toHaveBeenCalledWith({
      where: { id: '1', active: true },
      select: { name: true, id: true, active: false },
    });
  });
});
