import { Injectable, Logger } from '@nestjs/common';
import { CreateNotizDto, UpdateNotizDto } from '../types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notiz } from '../database/mongo/schemas/einsatz/notiz.schema';

@Injectable()
export class NotizenService {
  private readonly logger = new Logger(NotizenService.name);

  constructor(
    @InjectModel(Notiz.name) private readonly notizModel: Model<Notiz>,
  ) {}

  async findAllNotizen(einsatzId: string, bearbeiterId: string, done: boolean) {
    await this.notizModel
      .find(
        {
          einsatz: einsatzId,
          bearbeiter: bearbeiterId,
          done: done ? { $ne: null } : null,
          deleted: null,
        },
        {},
        {
          sort: {
            done: -1,
            createdAt: -1,
          },
        },
      )
      .exec();
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
    return this.notizModel.create({
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
    return this.notizModel
      .updateOne(
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
      )
      .exec();
  }

  async toggleCompleteNotiz(
    id: string,
    einsatzId: string,
    bearbeiterId: string,
  ) {
    const notiz = await this.notizModel.findOne({
      _id: id,
      einsatz: einsatzId,
      bearbeiter: bearbeiterId,
    });

    return this.notizModel
      .updateOne(
        { _id: id, einsatz: einsatzId, bearbeiter: bearbeiterId },
        { $set: { doneAt: notiz?.doneAt ? null : new Date() } },
      )
      .exec();
  }

  deleteNotiz(id: string, einsatzId: string, bearbeiterId: string) {
    return this.notizModel.updateOne(
      {
        _id: id,
        einsatz: einsatzId,
        bearbeiter: bearbeiterId,
      },
      { $set: { deletedAt: new Date() } },
    );
  }
}
