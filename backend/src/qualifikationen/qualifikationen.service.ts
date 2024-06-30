import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class QualifikationenService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.qualifikation.findMany();
  }
}
