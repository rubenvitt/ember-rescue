import { Injectable, Logger } from '@nestjs/common';
import { EinsatztagebuchEintragEnum, UpdateEinsatzDto } from '../types';
import { EinsatztagebuchService } from '../einsatztagebuch/einsatztagebuch.service';
import { FahrzeugeService } from '../fahrzeuge/fahrzeuge.service';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateEinsatzDto,
  Einsatz,
} from '@core/database/mongo/schemas/einsatz.schema';
import { FilterQuery, Model } from 'mongoose';
import { AlarmstichwortService } from '@templates/alarms/alarmstichwort.service';

@Injectable()
export class EinsatzService {
  private readonly logger = new Logger(EinsatzService.name);

  constructor(
    private readonly einsatztagebuchService: EinsatztagebuchService,
    private readonly fahrzeugeService: FahrzeugeService,
    private readonly alarmstichwortService: AlarmstichwortService,
    @InjectModel(Einsatz.name) private readonly einsatzModel: Model<Einsatz>,
  ) {}

  async getEinsatz(id: string) {
    const einsatz = await this.einsatzModel.findById(id).exec();
    if (!einsatz) {
      throw new Error('Einsatz not found');
    }
    return einsatz;
  }

  async createEinsatz(data: CreateEinsatzDto) {
    const einsatz = await this.einsatzModel.create(data);

    this.logger.log(`Einsatz '${einsatz.einsatznummer}' erstellt`);

    return einsatz;
  }

  getEinsaetze(filter: FilterQuery<Einsatz>) {
    return this.einsatzModel
      .find(
        filter,
        {},
        {
          sort: {
            createdAt: -1,
          },
        },
      )
      .exec();
  }

  closeEinsatz(einsatzId: string) {
    return this.einsatzModel.findByIdAndUpdate(einsatzId, {
      $set: {
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

      return this.einsatzModel.findByIdAndUpdate(einsatzId, {
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
      const aufnehmendesRettungsmittel =
        await this.fahrzeugeService.findFahrzeug({
          _id: einsatz.aufnehmendes_rettungsmittel['id'],
        });

      await this.einsatztagebuchService.createEinsatztagebuchEintrag(
        einsatzId,
        {
          einsatzId: einsatzId,
          type: EinsatztagebuchEintragEnum.GENERISCH,
          content: `Das Alarmstichwort wurde angepasst zu: ${alarmstichwort!!.code}`,
          absender: aufnehmendesRettungsmittel!!.fullOpta,
          empfaenger: aufnehmendesRettungsmittel!!.fullOpta,
        },
      );

      return this.einsatzModel.findOneAndUpdate(
        {
          _id: einsatzId,
        },
        {
          $set: {
            einsatzAlarmstichwort: alarmstichwort,
          },
        },
      );
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
