import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class EinsatztagebuchService {
  constructor(private prismaService: PrismaService) {}

  getEinsatztagebuch() {
    return this.prismaService.einsatztagebuchEintrag.findMany();
  }

  createEinsatztagebuchEintrag() {
    const eintrag = this.prismaService.einsatztagebuchEintrag.create({
      data: {
        type: 'GENERISCH',
        content: 'test',
        absender: 'test',
        empfaenger: 'test',
        timestamp: new Date(),
      },
    });

    return eintrag;
  }
}
