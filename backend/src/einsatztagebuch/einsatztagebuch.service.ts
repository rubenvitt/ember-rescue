import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { InjectModel } from '@nestjs/mongoose';
import { Einsatz } from '../database/mongo/schemas/einsatz.schema';
import { Model } from 'mongoose';

@Injectable()
export class EinsatztagebuchService {
  constructor(
    @InjectModel(Einsatz.name) private einsatzModel: Model<Einsatz>,
  ) {}

  async getEinsatztagebuch(einsatzId: string) {
    const einsatz = await this.einsatzModel.findById(einsatzId).exec();
    if (!einsatz) {
      throw new Error('Einsatz nicht gefunden');
    }

    return einsatz.einsatzTagebuch;
  }

  createEinsatztagebuchEintrag(
    einsatzId: string,
    data:
      | Prisma.EinsatztagebuchEintragCreateManyInput
      | Prisma.EinsatztagebuchEintragCreateManyInput[],
  ) {
    const mapData = (item: Prisma.EinsatztagebuchEintragCreateManyInput) => ({
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

    // if data is an array
    if (Array.isArray(data)) {
      return this.einsatzModel.findByIdAndUpdate(
        einsatzId,
        {
          $push: {
            einsatzTagebuch: {
              items: {
                $each: data.map(mapData),
              },
            },
          },
        },
        {},
      );
    }

    return this.einsatzModel.findByIdAndUpdate(
      einsatzId,
      {
        einsatzTagebuch: {
          $push: {
            items: {
              $each: [mapData(data)],
            },
          },
        },
      },
      {},
    );
  }

  archiveEinsatztagebuchEintrag(id: string) {
    this.einsatzModel.updateOne(
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
