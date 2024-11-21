import { InjectModel } from '@nestjs/mongoose';
import { Notiz } from './notiz.schema';
import { Model } from 'mongoose';
import { BaseRepository } from '@core/database/repositories/base.repository';

export class NotizenRepository extends BaseRepository<Notiz> {
  constructor(@InjectModel(Notiz.name) readonly model: Model<Notiz>) {
    super(model, NotizenRepository.name);
  }
}
