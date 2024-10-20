import { Test, TestingModule } from '@nestjs/testing';
import { FahrzeugeService } from './fahrzeuge.service';
import { PrismaService } from '../database/prisma/prisma.service';
import { FahrzeugDto } from '../types';

describe('EinheitenService', () => {
  let service: FahrzeugeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const prismaServiceMock = {
      einheit: {
        findMany: jest.fn().mockResolvedValue([]),
        upsert: jest.fn().mockResolvedValue({}),
        findUnique: jest.fn().mockResolvedValue({}),
      },
      einheitTyp: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      $transaction: jest.fn().mockImplementation(async (callback) => {
        return callback(prismaServiceMock);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FahrzeugeService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<FahrzeugeService>(FahrzeugeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all einheiten', async () => {
    const result = await service.findAll();
    expect(result).toEqual([]);
    expect(prismaService.einheit.findMany).toHaveBeenCalled();
  });

  it('should find all einheit typen', async () => {
    const result = await service.findTypen();
    expect(result).toEqual([]);
    expect(prismaService.einheitTyp.findMany).toHaveBeenCalled();
  });

  it('should update many einheiten', async () => {
    const einheiten: Omit<FahrzeugDto, 'status'>[] = [
      {
        id: '1',
        funkrufname: 'Funkrufname 1',
        einheitTyp: {
          id: 'typ1',
          label: 'Typ 1',
        },
        einheitTypId: 'typ1',
        kapazitaet: 4,
        istTemporaer: false,
      },
    ];

    await service.updateMany(einheiten);
    expect(prismaService.$transaction).toHaveBeenCalled();
  });

  it('should find a specific einheit', async () => {
    const result = await service.findFahrzeug({ id: '1' });
    expect(result).toEqual({});
    expect(prismaService.einheit.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
      include: {
        einheitTyp: {
          select: {
            id: true,
            label: true,
            description: true,
          },
        },
      },
    });
  });
});
