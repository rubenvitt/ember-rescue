import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Einsatz } from './einsatz.schema';
import {
  AnyKeys,
  FilterQuery,
  Model,
  MongooseUpdateQueryOptions,
  ProjectionType,
  QueryOptions,
  RootFilterQuery,
  UpdateQuery,
} from 'mongoose';

@Injectable()
export class EinsatzRepository {
  private readonly logger = new Logger(EinsatzRepository.name);

  constructor(
    @InjectModel(Einsatz.name) private readonly model: Model<Einsatz>,
  ) {}

  async findEinsatzById(einsatzId: string) {
    const einsatz = await this.model.findById(einsatzId);
    if (!einsatz) {
      throw new Error('Einsatz nicht gefunden');
    }
    return einsatz;
  }

  updateEinsatz(
    einsatzId: string,
    query: UpdateQuery<Einsatz>,
    options?: QueryOptions<Einsatz>,
  ) {
    return this.model.findByIdAndUpdate(einsatzId, query, options);
  }

  updateByQuery(
    filterQuery: RootFilterQuery<Einsatz>,
    updateQuery: UpdateQuery<Einsatz>,
    options?: MongooseUpdateQueryOptions<Einsatz>,
  ) {
    this.model.updateOne(filterQuery, updateQuery, options);
  }

  async findBy(id: string, param: RootFilterQuery<Einsatz>) {
    this.logger.log(`Find Einsatz ${id} by '${param}'`);

    return this.model.findOne({ ...param, _id: id }).exec();
  }

  async create(data: AnyKeys<Einsatz> | Array<AnyKeys<Einsatz>>) {
    this.logger.log(`Create Einsatz`, data);

    return this.model.create(data);
  }

  find(
    filter: FilterQuery<Einsatz>,
    projection: ProjectionType<Einsatz>,
    options?: QueryOptions<Einsatz>,
  ) {
    return this.model.find(filter, projection, options).exec();
  }

  async anyActive() {
    return (
      (await this.model
        .estimatedDocumentCount({ abgeschlossen: null })
        .exec()) > 0
    );
  }
}
