import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { EinheitDto } from '../types';
import { Prisma } from '@prisma/client';

@Injectable()
export class EinheitenService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.einheit.findMany({
      include: {
        _count: {
          select: {
            einsatz_einheit: true,
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
        einheitTyp: {
          select: {
            id: true,
            label: true,
          },
        },
      },
    });
  }

  findTypen() {
    return this.prismaService.einheitTyp.findMany({});
  }

  updateMany(einheiten: Omit<EinheitDto, 'status'>[]) {
    return this.prismaService.$transaction(async (transaction) => {
      for (const { einheitTyp: _, einheitTypId, id, ...einheit } of einheiten) {
        await transaction.einheit.upsert({
          where: {
            id: id,
          },
          update: {
            ...einheit,
            einheitTypId: einheitTypId,
          },
          create: {
            ...einheit,
            einheitTypId: einheitTypId,
          },
        });
      }
    });
  }

  findEinheit(where: Prisma.EinheitWhereUniqueInput) {
    return this.prismaService.einheit.findUnique({
      //
      where,
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
  }
}
