import { BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bearbeiter } from './bearbeiter.schema';

import { CacheKey } from '@nestjs/cache-manager';
import { BearbeiterDto } from './bearbeiter.dto';

export class BearbeiterCoreService {
  private logger = new Logger(BearbeiterCoreService.name);

  constructor(
    @InjectModel(Bearbeiter.name) private bearbeiterModel: Model<Bearbeiter>,
  ) {}

  async findAll(): Promise<BearbeiterDto[]> {
    return await this.bearbeiterModel
      .find({ active: true })
      .select('name')
      .exec();
  }

  async findByNameOrCreate(name: string) {
    let bearbeiter = await this.bearbeiterModel.findOne({ name: this.validateName(name) }).exec();

    if (!bearbeiter) {
      bearbeiter = await this.bearbeiterModel.create({
        name: this.validateName(name),
        active: true,
      });
    } else {
      bearbeiter = await this.bearbeiterModel
        .findOneAndUpdate(
          { name: this.validateName(name) },
          {
            $set: {
              active: true,
            },
          },
        )
        .exec();
    }

    return bearbeiter;
  }

  private validateName(name: string): string {
    if (!name || typeof name !== 'string') {
      throw new BadRequestException('Invalid name format');
    }
    if (name.length > 100) {
      throw new BadRequestException(`Name length must not exceed 100 characters`);
    }
    if (!/^[a-zA-Z0-9\-_]+$/.test(name)) {
      throw new BadRequestException('Name must only contain alphanumeric characters, hyphens and underscores');
    }
    return name.toString();
  }

  @CacheKey('bearbeiter')
  async findOne(name: string) {
    let bearbeiter = await this.bearbeiterModel
      .findOne({ name, active: true })
      .exec();
    return bearbeiter;
  }
}
