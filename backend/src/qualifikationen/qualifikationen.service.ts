import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Qualifikation } from '../core/database/mongo/schemas/qualifikation.schema';
import { Model } from 'mongoose';

@Injectable()
export class QualifikationenService {
  constructor(
    @InjectModel(Qualifikation.name)
    private readonly qualifikationModel: Model<Qualifikation>,
  ) {}

  findAll() {
    return this.qualifikationModel.find().exec();
  }
}
