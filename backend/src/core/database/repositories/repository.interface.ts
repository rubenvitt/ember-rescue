// src/core/database/repositories/repository.interface.ts

import {
  AnyKeys,
  Document,
  FilterQuery,
  MergeType,
  MongooseUpdateQueryOptions,
  QueryOptions,
  UpdateQuery,
  UpdateResult,
} from 'mongoose';

export interface IRepository<T extends Document> {
  findOne(filterQuery: FilterQuery<T>): Promise<T | null>;

  find(
    filterQuery: FilterQuery<T>,
    projection: AnyKeys<T> | null,
    options?: QueryOptions,
  ): Promise<T[]>;

  create(document: Partial<T>): Promise<T>;

  createMany(
    documents: Partial<T>[],
  ): Promise<Array<MergeType<T, Omit<any, '_id'>>>>;

  findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<T | null>;

  updateMany(
    documents: Partial<T>[],
    query: UpdateQuery<T>,
    options: MongooseUpdateQueryOptions<T>,
  ): Promise<UpdateResult>;

  upsert(filterQuery: FilterQuery<T>, document: Partial<T>): Promise<T>;

  deleteMany(filterQuery: FilterQuery<T>): Promise<boolean>;

  deleteOne(filterQuery: FilterQuery<T>): Promise<boolean>;

  count(filterQuery: FilterQuery<T>): Promise<number>;

  softDelete(id: string): Promise<T | null>;

  findActive(filterQuery?: FilterQuery<T>): Promise<T[]>;
}
