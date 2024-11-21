import { InjectModel } from '@nestjs/mongoose';
import { Notiz } from '@core/database/mongo/schemas/einsatz/notiz.schema';
import {
  AnyKeys,
  Model,
  MongooseUpdateQueryOptions,
  ProjectionType,
  QueryOptions,
  RootFilterQuery,
  UpdateQuery,
} from 'mongoose';
import { Einsatz } from '../schema/einsatz.schema';

export class NotizenRepository {
  constructor(@InjectModel(Notiz.name) private readonly model: Model<Notiz>) {}

  async find(
    filter: RootFilterQuery<Einsatz>,
    projection?: ProjectionType<Einsatz>,
    options?: QueryOptions<Einsatz>,
  ) {
    return this.model.find(filter, projection, options).exec();
  }

  async findOne(param: { einsatz: string; _id: string; bearbeiter: string }) {
    return this.model.findOne(param).exec();
  }

  create(data: AnyKeys<Notiz>) {
    return this.model.create(data);
  }

  updateOne(
    filter: RootFilterQuery<Einsatz>,
    query: UpdateQuery<Einsatz>,
    options?: MongooseUpdateQueryOptions<Einsatz>,
  ) {
    return this.model.updateOne(filter, query, options).exec();
  }
}
