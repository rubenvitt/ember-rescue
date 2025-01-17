import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EinsatzRepository } from '../schema/einsatz.repository';

@Injectable()
export class EinsatztagebuchService {
  private readonly logger = new Logger(EinsatztagebuchService.name);

  constructor(private readonly einsatzRepository: EinsatzRepository) {}

  async getEinsatztagebuch(einsatzId: string) {
    const einsatz = await this.einsatzRepository.findById(einsatzId);
    if (!einsatz) {
      throw new NotFoundException('Einsatz not found', {
        description: `Einsatz mit der ID ${einsatzId} nicht gefunden.`,
      });
    }
    return einsatz.einsatzTagebuch;
  }

  // FIXME[ember-rescue-68](rubeen, 15.11.24): TYPES
  createEinsatztagebuchEintrag(einsatzId: string, data: any | any[]) {
    const mapData = (item: any) => ({
      timestamp: item.timestamp,
      type: item.type,
      content: item.content,
      sender: item.absender, // geändert
      receiver: item.empfaenger, // geändert
      archived: item.archived,
      bearbeiter: item.bearbeiterId, // geändert
      //nummer: item.nummer || Math.floor(Date.now() / 1000), // hinzugefügt
    });

    this.einsatzRepository.findOne({ id: einsatzId }).then((einsatz) => {
      this.logger.log(
        'tagebuch',
        einsatz?.einsatzTagebuch ?? 'Einsatztagebuch is undefined',
      );
    });

    this.logger.log('Creating einsatztagebucheintrag');

    return this.einsatzRepository
      .findOneByIdAndUpdate(einsatzId, {
        $set: {
          'einsatzTagebuch.items': {
            $ifNull: ['$einsatzTagebuch.items', []],
          },
        },
      })
      .then(() =>
        this.einsatzRepository.findOneByIdAndUpdate(einsatzId, {
          $push: {
            'einsatzTagebuch.items': {
              $each: Array.isArray(data) ? data.map(mapData) : [mapData(data)],
            },
          },
        }),
      );
  }

  archiveEinsatztagebuchEintrag(id: string, missionId: string) {
    return this.einsatzRepository.findOneAndUpdate(
      {
        _id: missionId,
        einsatzTagebuch: {
          items: {
            $elemMatch: {
              id,
            },
          },
        },
      },
      {
        $set: {
          'einsatzTagebuch.items.$.archived': true,
        },
      },
    );
  }
}
