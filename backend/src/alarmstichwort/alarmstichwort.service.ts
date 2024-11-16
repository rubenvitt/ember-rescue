import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Alarmstichwort } from '../core/database/mongo/schemas/alarmstichwort.schema';
import { Model } from 'mongoose';

@Injectable()
export class AlarmstichwortService {
  private readonly logger: Logger = new Logger(AlarmstichwortService.name);

  constructor(
    @InjectModel(Alarmstichwort.name)
    private readonly alarmstichwortModel: Model<Alarmstichwort>,
  ) {}

  findAll() {
    return this.alarmstichwortModel.find({}).exec();
  }

  find(alarmstichwortId: string) {
    const alarmstichwort = this.alarmstichwortModel
      .findById(alarmstichwortId)
      .exec();
    if (!alarmstichwort) {
      throw new Error(`No Alarmstichwort found for ID ${alarmstichwortId}`);
    }
    return alarmstichwort;
  }
}
