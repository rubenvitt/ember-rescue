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

    const einsatz = await this.prismaService.einsatz.findUnique({
      where: { id: einsatzId },
      select: {
        aufnehmendes_rettungsmittel: { select: { funkrufname: true } },
      },
    });

    await this.einsatztagebuchService.createEinsatztagebuchEintrag({
      absender: existingEinheit.funkrufname,
      empfaenger: einsatz.aufnehmendes_rettungsmittel.funkrufname,
      type: 'RESSOURCEN',
      einsatzId,
      bearbeiterId,
      content: `${existingEinheit.funkrufname} (${existingEinheit.einheitTyp.label}) wurde dem Einsatz hinzugefügt.`,
    });

    await this.prismaService.einheitOnEinsatz.create({
      data: {
        einheitId,
        einsatzId,
        einsatzbeginn: new Date(),
      },
    });

    await this.changeStatus(einheitId, einsatzId, bearbeiterId, {
      statusCode: 3,
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

  async changeStatus(
    einheitId: string,
    einsatzId: string,
    bearbeiterId: string,
    {
      statusId,
      statusCode,
    }:
      | { statusCode?: never; statusId: string }
      | { statusCode: number; statusId?: never },
  ) {
    const status = statusId
      ? await this.statusService.findStatusById(statusId)
      : await this.statusService.findStatusByCode(statusCode);

    const einsatz = await this.prismaService.einsatz.findUnique({
      where: { id: einsatzId },
      select: {
        aufnehmendes_rettungsmittel: { select: { funkrufname: true } },
      },
    });

    await this.prismaService.$transaction(async (transaction) => {
      await transaction.einheitStatusHistorie.create({
        data: {
          einheitId,
          einsatzId,
          statusId: status.id,
          bearbeiterId,
          zeitpunkt: new Date(),
        },
      });

      const einheit = await transaction.einheit.update({
        where: { id: einheitId },
        data: {
          aktuellerStatusId: status.id,
        },
        include: {
          einheitTyp: true,
        },
      });

      await this.einsatztagebuchService.createEinsatztagebuchEintrag({
        einsatzId,
        bearbeiterId,
        type: 'RESSOURCEN',
        absender: einheit.funkrufname,
        empfaenger: einsatz.aufnehmendes_rettungsmittel.funkrufname,
        content: `${einheit.funkrufname} (${einheit.einheitTyp.label}) wechselt in Status ${status.code} (${status.bezeichnung}).`,
      });
    });
  }

  async removeEinheitFromEinsatz(
    einheitId: string,
    einsatzId: string,
    bearbeiterId: string,
  ) {
    return this.prismaService.$transaction(async (transaction) => {
      const existingEinheit = await this.einheitenService.findEinheit({
        id: einheitId,
      });

      const einsatz = await transaction.einsatz.findUnique({
        where: { id: einsatzId },
        select: {
          aufnehmendes_rettungsmittel: { select: { funkrufname: true } },
        },
      });

      await transaction.einheitOnEinsatz.delete({
        where: {
          einsatzId_einheitId: {
            einheitId,
            einsatzId,
          },
        },
      });

      await this.einsatztagebuchService.createEinsatztagebuchEintrag({
        absender: existingEinheit.funkrufname,
        empfaenger: einsatz.aufnehmendes_rettungsmittel.funkrufname,
        type: 'RESSOURCEN',
        einsatzId,
        bearbeiterId,
        content: `${existingEinheit.funkrufname} (${existingEinheit.einheitTyp.label}) wurde aus dem Einsatz entfernt.`,
      });
    });
  }
}
