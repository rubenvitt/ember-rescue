import { Test, TestingModule } from '@nestjs/testing';
import { EinsatzEinheitenService } from './einsatz-einheiten.service';
import { PrismaService } from '../../database/prisma/prisma.service';
import { EinsatztagebuchService } from '../../einsatztagebuch/einsatztagebuch.service';
import { EinheitenService } from '../../einheiten/einheiten.service';
import { StatusService } from '../../status/status.service';

describe('EinsatzEinheitenService', () => {
  let service: EinsatzEinheitenService;
  let prismaService: PrismaService;
  let einsatztagebuchService: EinsatztagebuchService;
  let einheitenService: EinheitenService;
  let statusService: StatusService;

  beforeEach(async () => {
    const prismaMock = {
      einheit: {
        findMany: jest.fn().mockResolvedValue([]),
        update: jest.fn().mockResolvedValue({
          funkrufname: 'Funkrufname 1',
          einheitTyp: { label: 'Label 1' },
        }),
      },
      einheitOnEinsatz: {
        create: jest.fn().mockResolvedValue(undefined),
        delete: jest.fn().mockResolvedValue(undefined),
      },
      einheitStatusHistorie: {
        create: jest.fn().mockResolvedValue(undefined),
      },
      $transaction: jest.fn().mockImplementation((callback) => {
        return callback({
          einheit: prismaMock.einheit,
          einheitOnEinsatz: prismaMock.einheitOnEinsatz,
          einheitStatusHistorie: prismaMock.einheitStatusHistorie,
        });
      }),
    };

    const einsatztagebuchMock = {
      createEinsatztagebuchEintrag: jest.fn().mockResolvedValue(undefined),
    };

    const einheitenMock = {
      findEinheit: jest.fn().mockResolvedValue({
        funkrufname: 'Funkrufname 1',
        einheitTyp: { label: 'Label 1' },
      }),
    };

    const statusMock = {
      findStatusById: jest.fn().mockResolvedValue({
        id: 'status1',
        code: 'Code 1',
        bezeichnung: 'Bezeichnung 1',
      }),
      findStatusByCode: jest.fn().mockResolvedValue({
        id: 'status1',
        code: 'Code 1',
        bezeichnung: 'Bezeichnung 1',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EinsatzEinheitenService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: EinsatztagebuchService, useValue: einsatztagebuchMock },
        { provide: EinheitenService, useValue: einheitenMock },
        { provide: StatusService, useValue: statusMock },
      ],
    }).compile();

    service = module.get<EinsatzEinheitenService>(EinsatzEinheitenService);
    prismaService = module.get<PrismaService>(PrismaService);
    einsatztagebuchService = module.get<EinsatztagebuchService>(
      EinsatztagebuchService,
    );
    einheitenService = module.get<EinheitenService>(EinheitenService);
    statusService = module.get<StatusService>(StatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add einheit to einsatz', async () => {
    await service.addEinheitToEinsatz('einheit1', 'einsatz1', 'bearbeiter1');
    expect(einheitenService.findEinheit).toHaveBeenCalledWith({
      id: 'einheit1',
    });
    expect(
      einsatztagebuchService.createEinsatztagebuchEintrag,
    ).toHaveBeenCalled();
    expect(prismaService.einheitOnEinsatz.create).toHaveBeenCalled();
  });

  it('should find einheiten im einsatz', async () => {
    const result = await service.findEinheitenImEinsatz({
      einsatzId: 'einsatz1',
    });
    expect(result).toEqual([]);
    expect(prismaService.einheit.findMany).toHaveBeenCalledWith({
      where: {
        einsatz_einheit: {
          some: {
            einsatzId: 'einsatz1',
          },
        },
      },
      include: {
        einsatz_einheit: true,
        einheitTyp: true,
        status: {
          select: {
            id: true,
            bezeichnung: true,
            beschreibung: false,
            code: true,
          },
        },
      },
    });
  });

  it('should change status of einheit in einsatz', async () => {
    await service.changeStatus('einheit1', 'einsatz1', 'bearbeiter1', {
      statusId: 'status1',
    });
    expect(statusService.findStatusById).toHaveBeenCalledWith('status1');
    expect(prismaService.einheit.update).toHaveBeenCalled(); // Sicherstellen, dass update aufgerufen wird
  });

  it('should remove einheit from einsatz', async () => {
    await service.removeEinheitFromEinsatz(
      'einheit1',
      'einsatz1',
      'bearbeiter1',
    );
    expect(prismaService.einheitOnEinsatz.delete).toHaveBeenCalledWith({
      where: {
        einsatzId_einheitId: {
          einheitId: 'einheit1',
          einsatzId: 'einsatz1',
        },
      },
    });
    expect(
      einsatztagebuchService.createEinsatztagebuchEintrag,
    ).toHaveBeenCalled();
  });
});
