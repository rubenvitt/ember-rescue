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
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  createEinsatztagebuchEintrag(
    data:
      | Prisma.EinsatztagebuchEintragCreateManyInput
      | Prisma.EinsatztagebuchEintragCreateManyInput[],
  ) {
    return this.prismaService.einsatztagebuchEintrag.createMany({
      data: data,
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
