import { Injectable, Logger } from '@nestjs/common';
import { CreateNotizDto, UpdateNotizDto } from '../../types';
import { NotizenRepository } from './notizen.repository';

@Injectable()
export class NotizenService {
  private readonly logger = new Logger(NotizenService.name);

  constructor(private readonly repository: NotizenRepository) {}

  async findAllNotizen(einsatzId: string, bearbeiterId: string, done: boolean) {
    return await this.repository.find(
      {
        einsatz: einsatzId,
        bearbeiter: bearbeiterId,
        done: done ? { $ne: null } : null,
        deleted: null,
      },
      null,
      {
        sort: {
          done: -1,
          createdAt: -1,
        },
      },
    );
  }

  createNotiz({
    einsatzId,
    bearbeiterId,
    notizDto,
  }: {
    einsatzId: string;
    bearbeiterId: string;
    notizDto: CreateNotizDto;
  }) {
    return this.repository.create({
      ...notizDto,
      einsatz: einsatzId,
      bearbeiter: bearbeiterId,
    });
  }

  async updateNotiz({
    bearbeiterId,
    einsatzId,
    notizDto,
    notizId,
  }: {
    bearbeiterId: string;
    einsatzId: string;
    notizDto: UpdateNotizDto;
    notizId: string;
  }) {
    return this.repository.findOneAndUpdate(
      {
        _id: notizId,
        einsatz: einsatzId,
        bearbeiter: bearbeiterId,
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
   * @param bearbeiter => bearbeiterId
   */
  async toggleCompleteNotiz(_id: string, einsatz: string, bearbeiter: string) {
    const notiz = await this.repository.findOne({
      _id,
      einsatz,
      bearbeiter,
    });

    return this.repository.findOneAndUpdate(
      { _id, einsatz, bearbeiter },
      { $set: { doneAt: notiz?.doneAt ? null : new Date() } },
    );
  }

  deleteNotiz(_id: string, einsatz: string, bearbeiter: string) {
    return this.repository.findOneAndUpdate(
      {
        _id,
        einsatz,
        bearbeiter,
      },
      { $set: { deletedAt: new Date() } },
    );
  }
}
