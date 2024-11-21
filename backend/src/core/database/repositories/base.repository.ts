import {
  AnyKeys,
  Document,
  FilterQuery,
  InsertManyOptions,
  MergeType,
  Model,
  MongooseUpdateQueryOptions,
  QueryOptions,
  RootFilterQuery,
  UpdateQuery,
  UpdateResult,
} from 'mongoose';
import { Logger, NotFoundException } from '@nestjs/common';
import { IRepository } from './repository.interface';

export abstract class BaseRepository<T extends Document>
  implements IRepository<T>
{
  protected readonly logger: Logger;

  protected constructor(
    protected readonly model: Model<T>,
    private readonly name: string,
  ) {
    this.logger = new Logger(name);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async findOne(filterQuery: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(filterQuery).exec();
    } catch (error) {
      this.logger.error(`Error finding document: ${error.message}`);
      throw error;
    }
  }

  async find(
    filterQuery: FilterQuery<T>,
    options?: QueryOptions,
  ): Promise<T[]> {
    try {
      return await this.model.find(filterQuery, null, options).exec();
    } catch (error) {
      this.logger.error(`Error finding documents: ${error.message}`);
      throw error;
    }
  }

  async create(data: AnyKeys<T> | Array<AnyKeys<T>>): Promise<T> {
    try {
      const newDocument = new this.model(data);
      return await newDocument.save();
    } catch (error) {
      this.logger.error(`Error creating document: ${error.message}`);
      throw error;
    }
  }

  async createMany(
    documents: Partial<T>[],
    options: InsertManyOptions = {},
  ): Promise<Array<MergeType<T, Omit<any, '_id'>>>> {
    try {
      return await this.model.insertMany(documents, options);
    } catch (error) {
      this.logger.error(`Error creating multiple documents: ${error.message}`);
      throw error;
    }
  }

  async findOneByIdAndUpdate(
    id: string,
    update: UpdateQuery<T>,
    options: QueryOptions = { new: true },
  ): Promise<T | null> {
    try {
      const document = await this.model
        .findByIdAndUpdate(id, update, options)
        .exec();
      if (!document && !options.upsert) {
        throw new NotFoundException(`${this.name} not found`);
      }
      return document;
    } catch (error) {
      this.logger.error(`Error updating document: ${error.message}`);
      throw error;
    }
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    update: UpdateQuery<T>,
    options: QueryOptions<T> = { new: true },
  ): Promise<T | null> {
    try {
      const document = await this.model
        .findOneAndUpdate(filterQuery, update, options)
        .exec();
      if (!document && !options.upsert) {
        throw new NotFoundException(`${this.name} not found`);
      }
      return document;
    } catch (error) {
      this.logger.error(`Error updating document: ${error.message}`);
      throw error;
    }
  }

  async updateMany(
    filter: RootFilterQuery<T>,
    query: UpdateQuery<T>,
    options: MongooseUpdateQueryOptions<T> = {},
  ): Promise<UpdateResult> {
    try {
      return await this.model.updateMany(filter, query, options);
    } catch (error) {
      this.logger.error(`Error creating multiple documents: ${error.message}`);
      throw error;
    }
  }

  async upsert(
    filterQuery: FilterQuery<T>,
    document: UpdateQuery<T>,
  ): Promise<T> {
    try {
      return (await this.model
        .findOneAndUpdate(filterQuery, document, {
          lean: true,
          upsert: true,
          new: true,
        })
        .exec()) as unknown as T;
    } catch (error) {
      this.logger.error(`Error upserting document: ${error.message}`);
      throw error;
    }
  }

  async deleteMany(filterQuery: FilterQuery<T>): Promise<boolean> {
    try {
      const result = await this.model.deleteMany(filterQuery).exec();
      return result.deletedCount > 0;
    } catch (error) {
      this.logger.error(`Error deleting documents: ${error.message}`);
      throw error;
    }
  }

  async deleteOne(filterQuery: FilterQuery<T>): Promise<boolean> {
    try {
      const result = await this.model.deleteOne(filterQuery).exec();
      return result.deletedCount === 1;
    } catch (error) {
      this.logger.error(`Error deleting document: ${error.message}`);
      throw error;
    }
  }

  async count(filterQuery: FilterQuery<T>): Promise<number> {
    try {
      return await this.model.countDocuments(filterQuery).exec();
    } catch (error) {
      this.logger.error(`Error counting documents: ${error.message}`);
      throw error;
    }
  }

  // Soft delete methods for entities that support it
  async softDelete(id: string): Promise<T | null> {
    return await this.findOneByIdAndUpdate(id, {
      $set: { deletedAt: new Date() },
    } as UpdateQuery<T>);
  }

  // Method to find active (non-deleted) documents
  async findActive(filterQuery: FilterQuery<T> = {}): Promise<T[]> {
    return this.find({
      ...filterQuery,
      deletedAt: { $exists: false },
    } as FilterQuery<T>);
  }
}
