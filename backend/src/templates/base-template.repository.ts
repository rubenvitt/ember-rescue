import {
  isCurrentlyActiveFilter,
  ITemplate,
} from '@templates/core/interfaces/template.interface';
import { ITemplateRepository } from '@templates/core/interfaces/template-repository.interface';
import { InsertManyOptions, Model } from 'mongoose';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class BaseTemplateRepository<T extends ITemplate>
  implements ITemplateRepository<T>
{
  protected readonly logger: Logger;

  protected constructor(
    protected readonly model: Model<T>,
    readonly loggername: string,
  ) {
    this.logger = new Logger(loggername);
  }

  findActive(): Promise<T[]> {
    return this.model
      .find({
        ...isCurrentlyActiveFilter,
      })
      .exec();
  }

  async findActiveById(id: string): Promise<T> {
    try {
      return (await this.model.findOne({
        _id: id,
        ...isCurrentlyActiveFilter,
      }))!!;
    } catch (e) {
      throw new NotFoundException(
        `${this.model.name} with id '` + id + "' not found",
      );
    }
  }

  create(template: Partial<T>): Promise<T> {
    return new this.model(template).save();
  }

  createMany(
    templates: Partial<T>[],
    options?: InsertManyOptions,
  ): Promise<T[]> {
    return this.model.insertMany(templates as T[], options || {});
  }

  async update(id: string, template: Partial<T>): Promise<T> {
    return (await this.model
      .findByIdAndUpdate(id, template, { new: true })
      .exec()) as T;
  }

  async deactivate(id: string): Promise<void> {
    await this.model
      .updateOne({ _id: id }, { isActive: false, validTo: new Date() })
      .exec();
  }

  findValidAt(date: Date): Promise<T[]> {
    return this.model
      .find({
        isActive: true,
        $and: [
          {
            $or: [
              { validFrom: { $lte: date } },
              { validFrom: { $exists: false } },
            ],
          },
          {
            $or: [{ validTo: { $gte: date } }, { validTo: { $exists: false } }],
          },
        ],
      })
      .exec();
  }
}
