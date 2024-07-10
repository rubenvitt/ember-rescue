import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { EinsatztagebuchService } from '../../einsatztagebuch/einsatztagebuch.service';
import { EinheitenService } from '../../einheiten/einheiten.service';

@Injectable()
export class EinsatzEinheitenService {
  private readonly logger = new Logger(EinsatzEinheitenService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly einsatztagebuchService: EinsatztagebuchService,
    private readonly einheitenService: EinheitenService,
  ) {}

  async addEinheitToEinsatz(
    einheitId: string,
    einsatzId: string,
    bearbeiterId: string,
  ) {
    const existingEinheit = await this.einheitenService.findEinheit({
      id: einheitId,
    });
    await this.einsatztagebuchService.createEinsatztagebuchEintrag({
      absender: 'ETB',
      empfaenger: 'ETB',
      type: 'RESSOURCEN',
      einsatz: {
        connect: { id: einsatzId },
      },
      bearbeiter: {
        connect: { id: bearbeiterId },
      },
      content: `${existingEinheit.funkrufname} (${existingEinheit.einheitTyp.label}) wurde dem Einsatz hinzugefügt.`,
      timestamp: new Date(),
    });

    await this.prismaService.einheitOnEinsatz.create({
      data: {
        einheitId,
        einsatzId,
        einsatzbeginn: new Date(),
      },
    });
  }
}
