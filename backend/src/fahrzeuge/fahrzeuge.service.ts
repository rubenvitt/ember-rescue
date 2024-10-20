import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { FahrzeugDto } from '../types';
import { Prisma } from '@prisma/client';

@Injectable()
export class FahrzeugeService {
  private readonly logger = new Logger(FahrzeugeService.name);

  constructor(private readonly prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.fahrzeug.findMany({
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
}
