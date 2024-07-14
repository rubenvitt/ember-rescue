import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { EinsatztagebuchService } from '../../einsatztagebuch/einsatztagebuch.service';
import { EinheitenService } from '../../einheiten/einheiten.service';
import { StatusService } from '../../status/status.service';

@Injectable()
export class EinsatzEinheitenService {
  private readonly logger = new Logger(EinsatzEinheitenService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly einsatztagebuchService: EinsatztagebuchService,
    private readonly einheitenService: EinheitenService,
    private readonly statusService: StatusService,
  ) {}

  async addEinheitToEinsatz(
    einheitId: string,
    einsatzId: string,
    bearbeiterId: string,
  ) {
    const existingEinheit = await this.einheitenService.findEinheit({
      id: einheitId,
    });
    const status = await this.statusService.findStatus(3);

    await this.einsatztagebuchService.createEinsatztagebuchEintrag([
      {
        absender: 'ETB',
        empfaenger: 'ETB',
        type: 'RESSOURCEN',
        einsatzId,
        bearbeiterId,
        content: `${existingEinheit.funkrufname} (${existingEinheit.einheitTyp.label}) wurde dem Einsatz hinzugefügt.`,
      },
      {
        absender: 'ETB',
        empfaenger: 'ETB',
        type: 'RESSOURCEN',
        einsatzId,
        bearbeiterId,
        content: `${existingEinheit.funkrufname} (${existingEinheit.einheitTyp.label}) wechselt in Status ${status.code} (${status.bezeichnung}).`,
      },
    ]);

    await this.prismaService.einheitOnEinsatz.create({
      data: {
        einheitId,
        einsatzId,
        einsatzbeginn: new Date(),
      },
    });
    await this.prismaService.einheitStatusHistorie.create({
      data: {
        einheitId,
        einsatzId,
        bearbeiterId,
        zeitpunkt: new Date(),
        statusId: status.id,
      },
    });

    await this.prismaService.einheit.update({
      where: { id: einheitId },
      data: {
        aktuellerStatusId: status.id,
      },
    });
  }

  async findEinheitenImEinsatz(param: { einsatzId: string }) {
    return this.prismaService.einheit.findMany({
      where: {
        einsatz_einheit: {
          some: {
            einsatzId: param.einsatzId,
          },
        },
      },
      include: {
        einsatz_einheit: true,
        einheitTyp: true,
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
