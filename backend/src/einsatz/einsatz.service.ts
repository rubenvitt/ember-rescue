import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { EinsatztagebuchEintragEnum, UpdateEinsatzDto } from '../types';
import { EinsatztagebuchService } from '../einsatztagebuch/einsatztagebuch.service';
import { AlarmstichwortService } from '../alarmstichwort/alarmstichwort.service';
import { FahrzeugeService } from '../fahrzeuge/fahrzeuge.service';

@Injectable()
export class EinsatzService {
  private readonly logger = new Logger(EinsatzService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly einsatztagebuchService: EinsatztagebuchService,
    private readonly fahrzeugeService: FahrzeugeService,
    private readonly alarmstichwortService: AlarmstichwortService,
  ) {}

  async getEinsatz(id: string) {
    return this.prismaService.einsatz
      .findUnique({
        where: { id },
        include: {
          aufnehmendes_rettungsmittel: {},
          einsatz_meta: {},
          einsatz_alarmstichwort: {
            include: {
              alarmstichwort: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      })
      .then((einsatz) => ({
        ...einsatz,
        einsatz_alarmstichwort:
          einsatz.einsatz_alarmstichwort[0].alarmstichwort,
      }));
  }

  async createEinsatz(data: Prisma.EinsatzCreateInput) {
    this.logger.debug('Creating Einsatz with data:', data);
    return this.prismaService.einsatz.create({
      data,
    });
  }

  getEinsaetze(where: Prisma.EinsatzWhereInput) {
    return this.prismaService.einsatz
      .findMany({
        where: where,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          einsatz_alarmstichwort: {
            include: {
              alarmstichwort: {
                select: {
                  bezeichnung: true,
                  beschreibung: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      })
      .then((list) => {
        return list.map((einsatz) => ({
          ...einsatz,
          einsatz_alarmstichwort:
            einsatz.einsatz_alarmstichwort[0]?.alarmstichwort,
        }));
      });
  }

  closeEinsatz(einsatzId: string) {
    return this.prismaService.einsatz.update({
      where: {
        id: einsatzId,
      },
      data: {
        abgeschlossen: new Date(),
      },
    });
  }

  async changeEinsatz(einsatzId: string, updateEinsatzDto: UpdateEinsatzDto) {
    this.logger.log('changeEinsatz', { einsatzId, updateEinsatzDto });

    const einsatz = await this.getEinsatz(einsatzId);

    return await Promise.all([
      this.updateEinsatzstichwort(einsatz, updateEinsatzDto, einsatzId),
      this.updateEinsatzort(einsatz, updateEinsatzDto, einsatzId),
    ]);
  }

  private async updateEinsatzort(
    einsatz: any,
    updateEinsatzDto: UpdateEinsatzDto,
    einsatzId: string,
  ) {
    if (
      this.einsatzortChanged(einsatz.einsatz_meta['ort'], updateEinsatzDto.ort)
    ) {
      await this.einsatztagebuchService.createEinsatztagebuchEintrag({
        einsatzId: einsatzId,
        type: EinsatztagebuchEintragEnum.GENERISCH,
        content: `Der Einsatzort wurde von ${einsatz.einsatz_meta['ort']} nach ${updateEinsatzDto.ort} verschoben.`,
        absender: einsatz.aufnehmendes_rettungsmittel.funkrufname,
        empfaenger: einsatz.aufnehmendes_rettungsmittel.funkrufname,
      });
      await this.prismaService.einsatzMeta.update({
        where: {
          einsatzId,
        },
        data: {
          ort: updateEinsatzDto.ort,
        },
      });
    } else {
      this.logger.log('Einsatzort hat sich nicht geändert.');
    }
  }

  private einsatzortChanged(currentOrt: string, updatedOrt: string) {
    this.logger.log('einsatzortChanged?', { currentOrt, updatedOrt });
    return currentOrt !== updatedOrt;
  }

  private async updateEinsatzstichwort(
    einsatz: any,
    updateEinsatzDto: UpdateEinsatzDto,
    einsatzId: string,
  ) {
    if (
      this.einsatzStichwortChanged(
        einsatz.einsatz_alarmstichwort['id'],
        updateEinsatzDto.alarmstichwort,
      )
    ) {
      const alarmstichwort = await this.alarmstichwortService.find(
        updateEinsatzDto.alarmstichwort,
      );
      const aufnehmendesRettungsmittel =
        await this.fahrzeugeService.findFahrzeug({
          id: einsatz.aufnehmendes_rettungsmittel['id'],
        });

      await this.einsatztagebuchService.createEinsatztagebuchEintrag({
        einsatzId: einsatzId,
        type: EinsatztagebuchEintragEnum.GENERISCH,
        content: `Das Alarmstichwort wurde angepasst zu: ${alarmstichwort.bezeichnung}`,
        absender: aufnehmendesRettungsmittel.funkrufname,
        empfaenger: aufnehmendesRettungsmittel.funkrufname,
      });
      return this.prismaService.einsatz.update({
        where: { id: einsatzId },
        data: {
          einsatz_alarmstichwort: {
            create: {
              alarmstichwortId: updateEinsatzDto.alarmstichwort,
            },
          },
        },
      });
    } else {
      // Kein Update erforderlich, da das alarmstichwort nicht geändert wurde
      this.logger.log('Alarmstichwort hat sich nicht geändert.');
      return einsatz;
    }
  }

  private einsatzStichwortChanged(id: string, alarmstichwort: string) {
    return id !== alarmstichwort;
  }
}
