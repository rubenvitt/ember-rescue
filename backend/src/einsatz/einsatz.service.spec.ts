import { Test, TestingModule } from '@nestjs/testing';
import { EinsatzService } from './einsatz.service';
import { PrismaService } from '../database/prisma/prisma.service';
import { EinsatztagebuchService } from '../einsatztagebuch/einsatztagebuch.service';
import { EinheitenService } from '../einheiten/einheiten.service';
import { AlarmstichwortService } from '../alarmstichwort/alarmstichwort.service';
import { Prisma } from '@prisma/client';
import { UpdateEinsatzDto } from '../types';

jest.useFakeTimers().setSystemTime(new Date('2024-08-09T12:19:50.671Z'));

describe('EinsatzService', () => {
  let service: EinsatzService;
  let prismaService: PrismaService;
  let einsatztagebuchService: EinsatztagebuchService;
  let einheitenService: EinheitenService;
  let alarmstichwortService: AlarmstichwortService;

  beforeEach(async () => {
    const prismaMock = {
      einsatz: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'einsatz1',
          aufnehmendesRettungsmittelId: 'rettungsmittel1',
          einsatz_alarmstichwort: [
            {
              alarmstichwort: {
                id: 'stichwort1',
                bezeichnung: 'Test',
                beschreibung: 'Test Beschreibung',
              },
            },
          ],
        }),
        create: jest.fn().mockResolvedValue({ id: 'einsatz1' }),
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'einsatz1',
            einsatz_alarmstichwort: [
              {
                alarmstichwort: {
                  bezeichnung: 'Test',
                  beschreibung: 'Test Beschreibung',
                },
              },
            ],
          },
        ]),
        update: jest
          .fn()
          .mockResolvedValue({ id: 'einsatz1', abgeschlossen: new Date() }),
      },
    };

    const einsatztagebuchMock = {
      createEinsatztagebuchEintrag: jest.fn().mockResolvedValue(null),
    };

    const einheitenMock = {
      findEinheit: jest.fn().mockResolvedValue({ funkrufname: 'TestFunk' }),
    };

    const alarmstichwortMock = {
      find: jest.fn().mockResolvedValue({ bezeichnung: 'New Test' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EinsatzService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: EinsatztagebuchService, useValue: einsatztagebuchMock },
        { provide: EinheitenService, useValue: einheitenMock },
        { provide: AlarmstichwortService, useValue: alarmstichwortMock },
      ],
    }).compile();

    service = module.get<EinsatzService>(EinsatzService);
    prismaService = module.get<PrismaService>(PrismaService);
    einsatztagebuchService = module.get<EinsatztagebuchService>(
      EinsatztagebuchService,
    );
    einheitenService = module.get<EinheitenService>(EinheitenService);
    alarmstichwortService = module.get<AlarmstichwortService>(
      AlarmstichwortService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get einsatz by id', async () => {
    const id = 'einsatz1';
    const result = await service.getEinsatz(id);
    expect(result).toEqual({
      id,
      aufnehmendesRettungsmittelId: 'rettungsmittel1',
      einsatz_alarmstichwort: {
        id: 'stichwort1',
        bezeichnung: 'Test',
        beschreibung: 'Test Beschreibung',
      },
    });
    expect(prismaService.einsatz.findUnique).toHaveBeenCalledWith({
      where: { id },
      include: {
        einsatz_alarmstichwort: {
          include: {
            alarmstichwort: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  });

  it('should create einsatz', async () => {
    const data: Prisma.EinsatzCreateInput = {
      bearbeiter: { connect: { id: 'bearbeiter1' } },
      beginn: new Date(),
      aufnehmendes_rettungsmittel: { connect: { id: 'rettungsmittel1' } },
      einsatz_alarmstichwort: {
        create: { alarmstichwortId: 'alarmstichwort1' },
      },
    };
    const result = await service.createEinsatz(data);
    expect(result).toEqual({ id: 'einsatz1' });
    expect(prismaService.einsatz.create).toHaveBeenCalledWith({ data });
  });

  it('should get all einsaetze', async () => {
    const where: Prisma.EinsatzWhereInput = { abgeschlossen: { not: null } };
    const result = await service.getEinsaetze(where);
    expect(result).toEqual([
      {
        id: 'einsatz1',
        einsatz_alarmstichwort: {
          bezeichnung: 'Test',
          beschreibung: 'Test Beschreibung',
        },
      },
    ]);
    expect(prismaService.einsatz.findMany).toHaveBeenCalledWith({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        einsatz_alarmstichwort: {
          include: {
            alarmstichwort: {
              select: {
                bezeichnung: true,
                beschreibung: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  });

  it('should close einsatz', async () => {
    const einsatzId = 'einsatz1';
    const result = await service.closeEinsatz(einsatzId);
    const currentTime = new Date().getTime();
    expect(result.id).toBe(einsatzId);
    expect(result.abgeschlossen.getTime()).toBeCloseTo(currentTime, -3);
    expect(prismaService.einsatz.update).toHaveBeenCalledWith({
      where: { id: einsatzId },
      data: { abgeschlossen: new Date() },
    });
  });

  it('should change einsatz if alarmstichwort has changed', async () => {
    const einsatzId = 'einsatz1';
    const updateEinsatzDto: UpdateEinsatzDto = { alarmstichwort: 'newId' };

    const result = await service.changeEinsatz(einsatzId, updateEinsatzDto);

    expect(alarmstichwortService.find).toHaveBeenCalledWith('newId');
    expect(einheitenService.findEinheit).toHaveBeenCalledWith({
      id: 'rettungsmittel1',
    });
    expect(
      einsatztagebuchService.createEinsatztagebuchEintrag,
    ).toHaveBeenCalledWith({
      einsatzId,
      type: 'LAGE', // Adjust if 'LAGE' is from an enum or other source
      content: 'Das Alarmstichwort wurde angepasst zu: New Test',
      absender: 'TestFunk',
      empfaenger: 'ETB',
    });
    expect(prismaService.einsatz.update).toHaveBeenCalledWith({
      where: { id: einsatzId },
      data: {
        einsatz_alarmstichwort: {
          create: {
            alarmstichwortId: 'newId',
          },
        },
      },
    });
    expect(result).toBeDefined();
  });

  it('should not change einsatz if alarmstichwort has not changed', async () => {
    const einsatzId = 'einsatz1';
    const updateEinsatzDto: UpdateEinsatzDto = { alarmstichwort: 'stichwort1' };

    const result = await service.changeEinsatz(einsatzId, updateEinsatzDto);

    expect(alarmstichwortService.find).not.toHaveBeenCalled();
    expect(einheitenService.findEinheit).not.toHaveBeenCalled();
    expect(
      einsatztagebuchService.createEinsatztagebuchEintrag,
    ).not.toHaveBeenCalled();
    expect(prismaService.einsatz.update).not.toHaveBeenCalled();
    expect(result).toEqual({
      id: 'einsatz1',
      aufnehmendesRettungsmittelId: 'rettungsmittel1',
      einsatz_alarmstichwort: {
        id: 'stichwort1',
        bezeichnung: 'Test',
        beschreibung: 'Test Beschreibung',
      },
    });
  });
});
