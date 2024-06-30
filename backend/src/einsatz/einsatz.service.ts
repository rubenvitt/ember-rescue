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
}
