import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { EinsatztagebuchService } from '../../einsatztagebuch/einsatztagebuch.service';
import { StatusService } from '../../status/status.service';
import { FahrzeugeService } from '../../fahrzeuge/fahrzeuge.service';

@Injectable()
export class EinsatzFahrzeugeService {
  private readonly logger = new Logger(EinsatzFahrzeugeService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly einsatztagebuchService: EinsatztagebuchService,
    private readonly fahrzeugeService: FahrzeugeService,
    private readonly statusService: StatusService,
  ) {}

  async addFahrzeugToEinsatz(
    fahrzeugId: string,
    einsatzId: string,
    bearbeiterId: string,
  ) {
    const existingFahrzeug = await this.fahrzeugeService.findFahrzeug({
      id: fahrzeugId,
    });

    const einsatz = await this.prismaService.einsatz.findUnique({
      where: { id: einsatzId },
      select: {
        aufnehmendes_rettungsmittel: { select: { funkrufname: true } },
      },
    });

    await this.einsatztagebuchService.createEinsatztagebuchEintrag({
      absender: existingFahrzeug.funkrufname,
      empfaenger: einsatz.aufnehmendes_rettungsmittel.funkrufname,
      type: 'RESSOURCEN',
      einsatzId,
      bearbeiterId,
      content: `${existingFahrzeug.funkrufname} (${existingFahrzeug.fahrzeugTyp.label}) wurde dem Einsatz hinzugefügt.`,
    });

    await this.prismaService.fahrzeugOnEinsatz.create({
      data: {
        fahrzeugId,
        einsatzId,
        einsatzbeginn: new Date(),
      },
    });

    await this.changeStatus(fahrzeugId, einsatzId, bearbeiterId, {
      statusCode: 3,
    });
  }

  async findFahrzeugeImEinsatz(param: { einsatzId: string }) {
    return this.prismaService.fahrzeug.findMany({
      where: {
        einsatz_fahrzeug: {
          some: {
            einsatzId: param.einsatzId,
          },
        },
      },
      include: {
        einsatz_fahrzeug: true,
        fahrzeugTyp: true,
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
    fahrzeugId: string,
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
      await transaction.fahrzeugStatusHistorie.create({
        data: {
          fahrzeugId,
          einsatzId,
          statusId: status.id,
          bearbeiterId,
          zeitpunkt: new Date(),
        },
      });

      const fahrzeug = await transaction.fahrzeug.update({
        where: { id: fahrzeugId },
        data: {
          aktuellerStatusId: status.id,
        },
        include: {
          fahrzeugTyp: true,
        },
      });

      await this.einsatztagebuchService.createEinsatztagebuchEintrag({
        einsatzId,
        bearbeiterId,
        type: 'RESSOURCEN',
        absender: fahrzeug.funkrufname,
        empfaenger: einsatz.aufnehmendes_rettungsmittel.funkrufname,
        content: `${fahrzeug.funkrufname} (${fahrzeug.fahrzeugTyp.label}) wechselt in Status ${status.code} (${status.bezeichnung}).`,
      });
    });
  }

  async removeFahrzeugFromEinsatz(
    fahrzeugId: string,
    einsatzId: string,
    bearbeiterId: string,
  ) {
    return this.prismaService.$transaction(async (transaction) => {
      const existingFahrzeug = await this.fahrzeugeService.findFahrzeug({
        id: fahrzeugId,
      });

      const einsatz = await transaction.einsatz.findUnique({
        where: { id: einsatzId },
        select: {
          aufnehmendes_rettungsmittel: { select: { funkrufname: true } },
        },
      });

      await transaction.fahrzeugOnEinsatz.delete({
        where: {
          einsatzId_fahrzeugId: {
            fahrzeugId,
            einsatzId,
          },
        },
      });

      await this.einsatztagebuchService.createEinsatztagebuchEintrag({
        absender: existingFahrzeug.funkrufname,
        empfaenger: einsatz.aufnehmendes_rettungsmittel.funkrufname,
        type: 'RESSOURCEN',
        einsatzId,
        bearbeiterId,
        content: `${existingFahrzeug.funkrufname} (${existingFahrzeug.fahrzeugTyp.label}) wurde aus dem Einsatz entfernt.`,
      });
    });
  }
}
