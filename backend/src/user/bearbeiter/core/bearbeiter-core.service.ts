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
    this.logger.log('BearbeiterController.findAll()');
    return await this.bearbeiterModel
      .find({ active: true })
      .select('name')
      .exec();
  }

  async findByNameOrCreate(name: string) {
    this.logger.log('BearbeiterController.findByNameOrCreate() name:' + name);
    let bearbeiter = await this.bearbeiterModel.findOne({ name }).exec();

    if (!bearbeiter) {
      this.logger.log(`Create new Bearbeiter named: ${name}`);
      bearbeiter = await this.bearbeiterModel.create({
        name,
        active: true,
      });
    } else {
      this.logger.log(`Found Bearbeiter`, { bearbeiter });
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
    this.logger.log(`BearbeiterController.findOne() ${name}`);
    let bearbeiter = await this.bearbeiterModel
      .findOne({ name, active: true })
      .exec();
    this.logger.log(`Found Bearbeiter`, { bearbeiter });
    return bearbeiter;
  }
}
