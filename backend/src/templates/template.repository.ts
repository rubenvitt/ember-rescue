import {
  isCurrentlyActiveFilter,
  ITemplate,
} from '@templates/core/interfaces/template.interface';
import { AnyKeys, Document, FilterQuery, Model, QueryOptions } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { BaseRepository } from '@core/database/repositories/base.repository';

export abstract class TemplateRepository<
  T extends Document & ITemplate,
> extends BaseRepository<T> {
  protected constructor(
    readonly model: Model<T>,
    readonly loggername: string,
  ) {
    super(model, loggername);
  }

  async findActive(
    additionalFilter: FilterQuery<T> = {},
    projection: AnyKeys<T> = {},
    options: QueryOptions = {},
  ): Promise<T[]> {
    const baseFilter = {
      ...isCurrentlyActiveFilter,
      ...additionalFilter,
    };
    return super.findActive(baseFilter, projection, options);
  }

  async findActiveById(id: string): Promise<T> {
    try {
      return (await this.model.findOne({
        _id: id,
        ...isCurrentlyActiveFilter,
      }))!!;
    } catch (e) {
      throw new NotFoundException(`${this.model.name} not found`, {
        description: `${this.model.name} with id '` + id + "' not found",
      });
    }
  }

  async deactivate(id: string): Promise<void> {
    await this.findOneAndUpdate({ _id: id } as FilterQuery<T>, {
      $set: {
        isActive: false,
        validTo: new Date(),
      },
    });
  }
}
