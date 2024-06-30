import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class StatusService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.status.findMany();
  }
}
