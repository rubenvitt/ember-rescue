import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Bearbeiter,
  BearbeiterDto,
} from '../core/database/mongo/schemas/bearbeiter.schema';
import { Model } from 'mongoose';

@Injectable()
export class BearbeiterService {
  private logger = new Logger(BearbeiterService.name);

  constructor(
    @InjectModel(Bearbeiter.name) private bearbeiterModel: Model<Bearbeiter>,
  ) {}

  async findAll() {
    this.logger.log('BearbeiterController.findAll()');
    const bearbeiter = await this.bearbeiterModel
      .find({ active: true })
      .select('name')
      .exec();

    return await Promise.all(
      bearbeiter.map(
        async (b) => await BearbeiterDto.fromBearbeiter(b.toObject()),
      ),
    );
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

    return BearbeiterDto.fromBearbeiter(bearbeiter);
  }

  async findOne(name: string) {
    this.logger.log(`BearbeiterController.findOne() ${name}`);
    let bearbeiter = await BearbeiterDto.fromBearbeiter(
      await this.bearbeiterModel.findOne({ name, active: true }).exec(),
    );
    this.logger.log(`Found Bearbeiter`, { bearbeiter });
    return bearbeiter;
  }
}
