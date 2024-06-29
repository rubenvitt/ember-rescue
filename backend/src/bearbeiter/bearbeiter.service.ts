import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class BearbeiterService {
  private logger = new Logger(BearbeiterService.name);

  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.bearbeiter.findMany({
      where: { active: true },
      select: { name: true, id: true, active: false },
    });
  }

  async findByNameOrCreate(name: string) {
    const bearbeiter = this.prismaService.bearbeiter.upsert({
      where: { name: name },
      update: { active: true },
      select: { name: true, id: true, active: false },
      create: { name: name, active: true },
    });

    this.logger.log(
      'BearbeiterService.findByNameOrCreate(), Using Bearbeiter: ',
      bearbeiter,
    );

    return bearbeiter;
  }
}
