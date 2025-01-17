import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EinsatztagebuchEintragEnum, UpdateEinsatzDto } from '../../types';
import { EinsatztagebuchService } from '../journal/einsatztagebuch.service';
import { FahrzeugeService } from '@templates/vehicles/fahrzeuge.service';
import { Einsatz } from '../schema/einsatz.schema';
import { FilterQuery } from 'mongoose';
import { AlarmstichwortRepository } from '@templates/alarmstichworte/alarmstichwort.repository';
import { EinsatzRepository } from '../schema/einsatz.repository';
import { CreateEinsatzParams, EinsatzDto } from './dto/einsatz.dto';
import { EinsatzMapper } from './einsatz.mapper';

@Injectable()
export class EinsatzCoreService {
  private readonly logger = new Logger(EinsatzCoreService.name);

  constructor(
    private readonly einsatztagebuchService: EinsatztagebuchService,
    private readonly fahrzeugeService: FahrzeugeService,
    private readonly alarmstichwortService: AlarmstichwortRepository,
    private readonly repository: EinsatzRepository,
    private readonly einsatzMapper: EinsatzMapper,
  ) {}

  async getEinsatz(id: string) {
    const einsatz = await this.repository.findById(id);
    if (!einsatz) {
      throw new NotFoundException('Einsatz not found', {
        description: `Einsatz mit der ID ${id} nicht gefunden.`,
      });
    }
    return einsatz;
  }

  async createEinsatz({
    createEinsatzDto,
  }: CreateEinsatzParams): Promise<EinsatzDto> {
    const alarmstichwort = await this.alarmstichwortService.findActive({
      code: createEinsatzDto.einsatzAlarmstichwort.code,
    });

    const einsatz = await this.repository.create({
      bearbeiter: createEinsatzDto.bearbeiter,
      beginn: new Date(),
      aufnehmendesRettungsmittel: createEinsatzDto.aufnehmendesRettungsmittel,
      einsatzAlarmstichwort: alarmstichwort.pop(),
      einsatzTagebuch: {
        items: [],
      },
      einsatzMeta: {
        ort: 'asd', // FIXME[ember-rescue-68](rubeen, 31.12.24): needs valid ORT from frontend
      },
    });

    this.logger.log('Created new Einsatz', { id: einsatz.id });

    // TODO[ember-rescue-68](rubeen, 21.11.24): maybe add eventHandling:
    //await this.eventEmitter.emit('einsatz.created', einsatz);

    return this.einsatzMapper.toDto(einsatz);
  }

  getEinsaetze(filter: FilterQuery<Einsatz>) {
    return this.repository.find(
      filter,
      {
        id: true,
        aufnehmendesRettungsmittel: true,
        bearbeiter: true,
        beginn: true,
        ende: true,
        einsatzAlarmstichwort: true,
        einsatzMeta: true,
      },
      {
        sort: {
          createdAt: -1,
        },
      },
    );
  }

  closeEinsatz(einsatzId: string) {
    return this.repository.findOneByIdAndUpdate(einsatzId, {
      $set: {
        abgeschlossen: new Date(),
      },
    });
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

      return this.repository.findOneByIdAndUpdate(einsatzId, {
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

      return this.repository.findOneByIdAndUpdate(einsatzId, {
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
