import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateNotizDto, UpdateNotizDto } from '../types';

@Injectable()
export class NotizenService {
  private readonly logger = new Logger(NotizenService.name);

  constructor(private readonly prismaService: PrismaService) {}

  findAllNotizen(einsatzId: string, bearbeiterId: string) {
    return this.prismaService.notiz.findMany({
      where: {
        einsatzId,
        bearbeiterId,
      },
      include: {
        bearbeiter: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  createNotiz({
    einsatzId,
    bearbeiterId,
    notizDto,
  }: {
    einsatzId: string;
    bearbeiterId: string;
    notizDto: CreateNotizDto;
  }) {
    return this.prismaService.notiz.create({
      data: {
        ...notizDto,
        id: undefined,
        bearbeiterId,
        einsatzId,
      },
    });
  }

  async updateNotiz({
    bearbeiterId,
    einsatzId,
    notizDto,
    notizId,
  }: {
    bearbeiterId: string;
    einsatzId: string;
    notizDto: UpdateNotizDto;
    notizId: string;
  }) {
    const prismaNotizClient = await this.prismaService.notiz.update({
      where: { id: notizId, einsatzId },
      data: {
        content: notizDto.content.trim(),
      },
    });
    this.logger.log('Updated notiz', prismaNotizClient);
    return prismaNotizClient;
  }
}
