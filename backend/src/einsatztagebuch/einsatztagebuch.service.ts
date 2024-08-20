import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class EinsatztagebuchService {
  constructor(private prismaService: PrismaService) {}

  getEinsatztagebuch(einsatzId: string) {
    return this.prismaService.einsatztagebuchEintrag.findMany({
      where: {
        einsatzId,
      },
      orderBy: [{ timestamp: 'desc' }, { createdAt: 'desc' }],
    });
  }

  createEinsatztagebuchEintrag(
    data:
      | Prisma.EinsatztagebuchEintragCreateManyInput
      | Prisma.EinsatztagebuchEintragCreateManyInput[],
  ) {
    const mapData = (item: Prisma.EinsatztagebuchEintragCreateManyInput) => ({
      timestamp: item.timestamp,
      type: item.type,
      content: item.content,
      absender: item.absender,
      empfaenger: item.empfaenger,
      archived: item.archived,
      einsatzId: item.einsatzId,
      bearbeiterId: item.bearbeiterId,
      id: undefined,
      fortlaufende_nummer: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    });

    // if data is an array
    if (Array.isArray(data)) {
      return this.prismaService.einsatztagebuchEintrag.createMany({
        data: data.map(mapData),
      });
    }

    return this.prismaService.einsatztagebuchEintrag.createMany({
      data: mapData(data),
    });
  }

  archiveEinsatztagebuchEintrag(id: string) {
    return this.prismaService.einsatztagebuchEintrag.update({
      where: { id },
      data: {
        archived: true,
      },
    });
  }
}
