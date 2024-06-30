import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

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
      },
    });
  }
}
