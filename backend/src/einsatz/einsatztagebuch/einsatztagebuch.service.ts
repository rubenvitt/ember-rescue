import { Injectable, NotFoundException } from '@nestjs/common';
import { EinsatzRepository } from '../schema/einsatz.repository';

@Injectable()
export class EinsatztagebuchService {
  constructor(private readonly einsatzRepository: EinsatzRepository) {}

  async getEinsatztagebuch(einsatzId: string) {
    const einsatz = await this.einsatzRepository.findById(einsatzId);
    if (!einsatz) {
      throw new NotFoundException(`Einsatz ${einsatzId} wurde nicht gefunden`);
    }
    return einsatz.einsatzTagebuch;
  }

  // FIXME[ember-rescue-68](rubeen, 15.11.24): TYPES
  createEinsatztagebuchEintrag(einsatzId: string, data: any | any[]) {
    const mapData = (item: any) => ({
      timestamp: item.timestamp,
      type: item.type,
      content: item.content,
      absender: item.absender,
      empfaenger: item.empfaenger,
      archived: item.archived,
      //einsatzId: item.einsatzId,
      bearbeiterId: item.bearbeiterId,
      id: undefined,
      fortlaufende_nummer: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    });

    return this.einsatzRepository.findOneByIdAndUpdate(einsatzId, {
      $push: {
        einsatzTagebuch: {
          items: {
            $each: Array.isArray(data) ? data.map(mapData) : [mapData(data)],
          },
        },
      },
    });
  }

  archiveEinsatztagebuchEintrag(id: string) {
    return this.einsatzRepository.updateMany(
      {
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
