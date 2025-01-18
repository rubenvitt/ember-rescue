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
  async createEinsatztagebuchEintrag(einsatzId: string, data: any | any[]) {
    // helper method transforming entry
    const mapData = (item: any) => ({
      timestamp: item.timestamp ?? new Date().toISOString(),
      type: item.type,
      content: item.content,
      sender: item.absender, // changed
      receiver: item.empfaenger, // changed
      archived: item.archived,
      bearbeiter: item.bearbeiterId, // changed
      //nummer is set later
    });

    // entry / entries as array
    const mappedData = Array.isArray(data)
      ? data.map(mapData)
      : [mapData(data)];

    // mission exists?
    const mission = await this.einsatzRepository.findById(einsatzId);
    if (!mission) {
      throw new NotFoundException('Mission not found');
    }

    // create items if not existent yet
    if (!mission.einsatzTagebuch?.items) {
      await this.einsatzRepository.findOneByIdAndUpdate(einsatzId, {
        $set: { 'einsatzTagebuch.items': [] },
      });
    }

    // increment counter
    const updatedMission = await this.einsatzRepository.findOneByIdAndUpdate(
      einsatzId,
      {
        $inc: { 'einsatzTagebuch.counter': mappedData.length },
      },
      { new: true },
    );
    if (!updatedMission) {
      throw new NotFoundException('Mission not found (on inc)');
    }

    // count old base
    const oldValue = updatedMission.einsatzTagebuch.counter - mappedData.length;

    // set counter to entries
    const dataForInsert = mappedData.map((item, index) => ({
      ...item,
      nummer: oldValue + index + 1,
    }));

    return await this.einsatzRepository.findOneByIdAndUpdate(einsatzId, {
      $push: {
        'einsatzTagebuch.items': {
          $each: dataForInsert,
        },
      },
    });
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
