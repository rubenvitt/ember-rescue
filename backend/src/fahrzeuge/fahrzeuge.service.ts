import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { FahrzeugDto, FahrzeugImportDto } from '../types';
import { Prisma } from '@prisma/client';

@Injectable()
export class FahrzeugeService {
  private readonly logger = new Logger(FahrzeugeService.name);

  constructor(private readonly prismaService: PrismaService) {}

  findAll(filter?: Prisma.FahrzeugWhereInput) {
    return this.prismaService.fahrzeug.findMany({
      where: filter,
      include: {
        _count: {
          select: {
            einsatz_fahrzeug: true,
          },
        },
        status: {
          select: {
            id: true,
            bezeichnung: true,
            beschreibung: false,
            code: true,
          },
        },
        fahrzeugTyp: {
          select: {
            id: true,
            label: true,
          },
        },
      },
      orderBy: {
        funkrufname: 'asc',
      },
    });
  }

  findTypen() {
    return this.prismaService.fahrzeugTyp.findMany({});
  }

  updateMany(fahrzeuge: Omit<FahrzeugDto, 'status'>[]) {
    return this.prismaService.$transaction(async (transaction) => {
      for (const {
        fahrzeugTyp: _,
        fahrzeugTypId,
        id,
        ...fahrzeug
      } of fahrzeuge) {
        await transaction.fahrzeug.upsert({
          where: {
            id: id,
          },
          update: {
            ...fahrzeug,
            fahrzeugTypId: fahrzeugTypId,
          },
          create: {
            ...fahrzeug,
            fahrzeugTypId: fahrzeugTypId,
          },
        });
      }
    });
  }

  findFahrzeug(where: Prisma.FahrzeugWhereUniqueInput) {
    return this.prismaService.fahrzeug.findUnique({
      where,
      include: {
        fahrzeugTyp: {
          select: {
            id: true,
            label: true,
            description: true,
          },
        },
      },
    });
  }

  async importFahrzeuge(fahrzeuge: FahrzeugImportDto[]) {
    return this.prismaService.$transaction(async (transaction) => {
      for (const fahrzeug of fahrzeuge) {
        // find by funkrufname (if not istTemporaer) for manual upsert
        const existingFahrzeug = await transaction.fahrzeug.findFirst({
          where: {
            funkrufname: fahrzeug.funkrufname,
            istTemporaer: false,
          },
        });

        // find fahrzeugtyp by label or throw
        const fahrzeugTyp = await transaction.fahrzeugTyp.findFirst({
          where: {
            label: fahrzeug.fahrzeugTyp,
          },
        });
        if (!fahrzeugTyp) {
          throw new Error(`Fahrzeugtyp ${fahrzeug.fahrzeugTyp} nicht gefunden`);
        }

        await transaction.fahrzeug.upsert({
          where: {
            id: existingFahrzeug?.id ?? '',
          },
          create: {
            funkrufname: fahrzeug.funkrufname,
            kapazitaet: fahrzeug.kapazitaet,
            istTemporaer: false,
            fahrzeugTyp: {
              connect: {
                id: fahrzeugTyp.id,
              },
            },
          },
          update: {
            funkrufname: fahrzeug.funkrufname,
            kapazitaet: fahrzeug.kapazitaet,
            istTemporaer: false,
            fahrzeugTyp: {
              connect: {
                id: fahrzeugTyp.id,
              },
            },
          },
        });
      }
    });
  }
}
