import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EinsatzService {
  constructor(private readonly prismaService: PrismaService) {}

  async getEinsatz(id: string) {
    return this.prismaService.einsatz.findUnique({
      where: { id },
    });
  }

  async createEinsatz(data: Prisma.EinsatzCreateInput) {
    return this.prismaService.einsatz.create({
      data,
    });
  }

  getEinsaetze(where: Prisma.EinsatzWhereInput) {
    return this.prismaService.einsatz
      .findMany({
        where: where,
        orderBy: {
          createdAt: 'desc',
        },
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
      })
      .then((list) => {
        return list.map((einsatz) => ({
          ...einsatz,
          einsatz_alarmstichwort:
            einsatz.einsatz_alarmstichwort[0]?.alarmstichwort,
        }));
      });
  }

  closeEinsatz(einsatzId: string) {
    return this.prismaService.einsatz.update({
      where: {
        id: einsatzId,
      },
      data: {
        abgeschlossen: new Date(),
      },
    });
  }
}
