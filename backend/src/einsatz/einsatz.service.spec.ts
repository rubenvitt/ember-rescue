import { Test, TestingModule } from '@nestjs/testing';
import { EinsatzService } from './einsatz.service';
import { PrismaService } from '../database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

describe('EinsatzService', () => {
  let service: EinsatzService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const prismaMock = {
      einsatz: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'einsatz1',
          einsatz_alarmstichwort: [
            {
              alarmstichwort: {
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EinsatzService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<EinsatzService>(EinsatzService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get einsatz by id', async () => {
    const id = 'einsatz1';
    const result = await service.getEinsatz(id);
    expect(result).toEqual({
      id,
      einsatz_alarmstichwort: {
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
      data: { abgeschlossen: expect.any(Date) },
    });
  });
});
