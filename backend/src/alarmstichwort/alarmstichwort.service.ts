import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class AlarmstichwortService {
  private readonly logger: Logger = new Logger(AlarmstichwortService.name);

  constructor(private readonly prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.alarmstichwort.findMany({});
  }

  find(alarmstichwortId: string) {
    return this.prismaService.alarmstichwort.findUnique({
      where: { id: alarmstichwortId },
    });
  }
}
