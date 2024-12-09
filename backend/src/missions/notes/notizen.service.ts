import { Injectable, Logger } from '@nestjs/common';
import { CreateNotizDto, UpdateNotizDto } from '../../types';
import { NotizenRepository } from './notizen.repository';
import { BearbeiterCoreService } from '../../user/bearbeiter/core/bearbeiter-core.service';
import mongoose from 'mongoose';

@Injectable()
export class NotizenService {
  private readonly logger = new Logger(NotizenService.name);

  constructor(
    private readonly repository: NotizenRepository,
    private readonly bearbeiterCoreService: BearbeiterCoreService,
  ) {}

  async findAllNotizen(
    einsatzId: string,
    bearbeiterName: string,
    done: boolean,
  ) {
    this.logger.log('Find all notizen for einsatz', einsatzId, bearbeiterName);

    const result = await this.repository.model.aggregate([
      {
        $lookup: {
          from: 'bearbeiters',
          localField: 'bearbeiter',
          foreignField: '_id',
          as: 'bearbeiterDetails',
        },
      },
      {
        $unwind: '$bearbeiterDetails',
      },
      {
        $match: {
          'bearbeiterDetails.name': 'Bearbeiter: rubeen',
          einsatz: new mongoose.Types.ObjectId(einsatzId),
          done: done ? { $ne: null } : null,
          deleted: null,
        },
      },
      {
        $sort: {
          doneAt: 1,
        },
      },
    ]);
    this.logger.log('Found notizen', result);

    return result;
  }

  async createNotiz({
    einsatzId,
    bearbeiterName,
    notizDto,
  }: {
    einsatzId: string;
    bearbeiterName: string;
    notizDto: CreateNotizDto;
  }) {
    const bearbeiter = await this.bearbeiterCoreService.findOne(bearbeiterName);

    this.logger.log('Create notiz for bearbeiter with id', bearbeiter?.id);

    const saveResult = await this.repository.create({
      einsatz: einsatzId,
      bearbeiter: bearbeiter,
      bearbeiterId: bearbeiter?.id,
      content: notizDto.content,
    });

    return saveResult.populate('bearbeiter');
  }

  async updateNotiz({
    bearbeiterName,
    einsatzId,
    notizDto,
    notizId,
  }: {
    bearbeiterName: string;
    einsatzId: string;
    notizDto: UpdateNotizDto;
    notizId: string;
  }) {
    const bearbeiter = await this.bearbeiterCoreService.findOne(bearbeiterName);

    return this.repository.findOneAndUpdate(
      {
        _id: notizId,
        einsatz: einsatzId,
        bearbeiter: bearbeiter?.id,
      },
      {
        $set: {
          content: notizDto.content.trim(),
        },
      },
    );
  }

  /**
   *
   * @param _id
   * @param einsatz => einsatzId
   * @param bearbeiterName => bearbeiterId
   */
  async toggleCompleteNotiz(
    _id: string,
    einsatz: string,
    bearbeiterName: string,
  ) {
    const bearbeiter = await this.bearbeiterCoreService.findOne(bearbeiterName);

    const notiz = await this.repository.findOne({
      _id,
      einsatz,
      bearbeiter: bearbeiter?.id,
    });

    return this.repository.findOneAndUpdate(
      { _id, einsatz, bearbeiter: bearbeiter?.id },
      { $set: { doneAt: notiz?.doneAt ? null : new Date() } },
    );
  }

  async deleteNotiz(_id: string, einsatz: string, bearbeiterName: string) {
    const bearbeiter = await this.bearbeiterCoreService.findOne(bearbeiterName);

    return this.repository.findOneAndUpdate(
      {
        _id,
        einsatz,
        bearbeiter: bearbeiter?.id,
      },
      { $set: { deletedAt: new Date() } },
    );
  }
}
