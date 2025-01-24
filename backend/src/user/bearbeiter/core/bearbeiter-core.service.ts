import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bearbeiter } from './bearbeiter.schema';
import { Model } from 'mongoose';

import { BearbeiterDto } from './bearbeiter.dto';
import { CacheKey } from '@nestjs/cache-manager';

@Injectable()
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
    let bearbeiter = await this.bearbeiterModel.findOne({ name }).exec();

    if (!bearbeiter) {
      bearbeiter = await this.bearbeiterModel.create({
        name,
        active: true,
      });
    } else {
      bearbeiter = await this.bearbeiterModel
        .findOneAndUpdate(
          { name },
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

  @CacheKey('bearbeiter')
  async findOne(name: string) {
    let bearbeiter = await this.bearbeiterModel
      .findOne({ name, active: true })
      .exec();
    return bearbeiter;
  }
}
