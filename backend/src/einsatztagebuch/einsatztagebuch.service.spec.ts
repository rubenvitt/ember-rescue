import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/prisma/prisma.service';
import { EinsatztagebuchService } from './einsatztagebuch.service';

describe('EinsatztagebuchService', () => {
  let service: EinsatztagebuchService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EinsatztagebuchService,
        {
          provide: PrismaService,
          useValue: {
            einsatztagebuchEintrag: {
              findMany: jest.fn().mockResolvedValue([]),
              createMany: jest.fn(),
              update: jest
                .fn()
                .mockResolvedValue({ id: 'eintrag1', archived: true }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<EinsatztagebuchService>(EinsatztagebuchService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get einsatztagebuch', async () => {
    const result = await service.getEinsatztagebuch('einsatz1');
    expect(result).toEqual([]);
    expect(prismaService.einsatztagebuchEintrag.findMany).toHaveBeenCalledWith({
      where: { einsatzId: 'einsatz1' },
      orderBy: [{ timestamp: 'desc' }, { createdAt: 'desc' }],
    });
  });

  it('should create einsatztagebuch eintrag', async () => {
    const createData = {
      timestamp: new Date().toISOString(),
      type: 'USER',
      content: 'Testinhalt',
      absender: 'Testabsender',
      empfaenger: 'Testempfänger',
      archived: false,
      einsatzId: 'einsatz1',
      bearbeiterId: 'bearbeiter1',
    };

    await service.createEinsatztagebuchEintrag(createData);
    expect(
      prismaService.einsatztagebuchEintrag.createMany,
    ).toHaveBeenCalledWith({
      data: {
        ...createData,
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      },
    });
  });

  it('should handle array of parameters correctly when creating einsatztagebuch eintrag', async () => {
    const createDataArray = [
      {
        timestamp: new Date().toISOString(),
        type: 'USER',
        content: 'Testinhalt1',
        absender: 'Testabsender1',
        empfaenger: 'Testempfänger1',
        archived: false,
        einsatzId: 'einsatz1',
        bearbeiterId: 'bearbeiter1',
      },
      {
        timestamp: new Date().toISOString(),
        type: 'SYSTEM',
        content: 'Testinhalt2',
        absender: 'Testabsender2',
        empfaenger: 'Testempfänger2',
        archived: false,
        einsatzId: 'einsatz2',
        bearbeiterId: 'bearbeiter2',
      },
    ];

    await service.createEinsatztagebuchEintrag(createDataArray);
    expect(
      prismaService.einsatztagebuchEintrag.createMany,
    ).toHaveBeenCalledWith({
      data: createDataArray.map((item) => ({
        ...item,
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      })),
    });
  });

  it('should archive einsatztagebuch eintrag', async () => {
    const id = 'eintrag1';
    const result = await service.archiveEinsatztagebuchEintrag(id);
    expect(result).toEqual({ id, archived: true });
    expect(prismaService.einsatztagebuchEintrag.update).toHaveBeenCalledWith({
      where: { id },
      data: { archived: true },
    });
  });
});
