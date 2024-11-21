import { Injectable, Logger } from '@nestjs/common';
import { EinsatztagebuchEintragEnum, UpdateEinsatzDto } from '../../types';
import { EinsatztagebuchService } from '../einsatztagebuch/einsatztagebuch.service';
import { FahrzeugeService } from '@templates/fahrzeuge/fahrzeuge.service';
import { CreateEinsatzDto, Einsatz } from '../schema/einsatz.schema';
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { AlarmstichwortRepository } from '@templates/alarmstichworte/alarmstichwort.repository';
import { EinsatzRepository } from '../schema/einsatz.repository';

@Injectable()
export class EinsatzCoreService {
  private readonly logger = new Logger(EinsatzCoreService.name);

  constructor(
    private readonly einsatztagebuchService: EinsatztagebuchService,
    private readonly fahrzeugeService: FahrzeugeService,
    private readonly alarmstichwortService: AlarmstichwortRepository,
    private readonly repository: EinsatzRepository,
  ) {}

  async getEinsatz(id: string) {
    const einsatz = await this.repository.findEinsatzById(id);
    if (!einsatz) {
      throw new Error('Einsatz not found');
    }
    return einsatz;
  }

  async createEinsatz(data: CreateEinsatzDto) {
    const einsatz = await this.repository.create(data);

    this.logger.log(`Einsatz '${einsatz.einsatznummer}' erstellt`);

    return einsatz;
  }

  getEinsaetze(filter: FilterQuery<Einsatz>) {
    return this.repository.find(
      filter,
      {},
      {
        sort: {
          createdAt: -1,
        },
      },
    );
  }

  closeEinsatz(einsatzId: string) {
    return this.repository.updateEinsatz(einsatzId, {
      $set: {
        abgeschlossen: new Date(),
      },
    });
  }

  // TODO: This one does not call exec(). Refactor this?
  updateEinsatz(
    id: string,
    data: UpdateQuery<Einsatz>,
    options?: QueryOptions,
  ) {
    this.logger.log(`updateEinsatz '${id}'`);
    return this.repository.updateEinsatz(id, data, options);
  }

  /**
   * @deprecated ? - maybe this one or updateEinsatz
   * @param einsatzId
   * @param updateEinsatzDto
   */
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
      await this.einsatztagebuchService.createEinsatztagebuchEintrag(
        einsatzId,
        {
          einsatzId: einsatzId,
          type: EinsatztagebuchEintragEnum.GENERISCH,
          content: `Der Einsatzort wurde von ${einsatz.einsatz_meta['ort']} nach ${updateEinsatzDto.ort} verschoben.`,
          absender: einsatz.aufnehmendes_rettungsmittel.funkrufname,
          empfaenger: einsatz.aufnehmendes_rettungsmittel.funkrufname,
        },
      );

      return this.repository.updateEinsatz(einsatzId, {
        $set: {
          einsatzMeta: {
            ort: updateEinsatzDto.ort,
          },
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
      const alarmstichwort = await this.alarmstichwortService.findActiveById(
        updateEinsatzDto.alarmstichwort,
      );
      //const aufnehmendesRettungsmittel = await this.fahrzeugeService.findFahrzeugeinsatz.aufnehmendes_rettungsmittel['id']        });

      await this.einsatztagebuchService.createEinsatztagebuchEintrag(
        einsatzId,
        {
          einsatzId: einsatzId,
          type: EinsatztagebuchEintragEnum.GENERISCH,
          content: `Das Alarmstichwort wurde angepasst zu: ${alarmstichwort!!.code}`,
          absender: einsatz.aufnehmendesRettungsmittel,
          empfaenger: einsatz.aufnehmendesRettungsmittel,
        },
      );

      return this.repository.updateEinsatz(einsatzId, {
        $set: {
          einsatzAlarmstichwort: alarmstichwort,
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
