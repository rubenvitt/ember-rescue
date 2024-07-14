import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

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
}
