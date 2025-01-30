import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Einsatz } from './einsatz.schema';
import { Model } from 'mongoose';
import { BaseRepository } from '@core/database/repositories/base.repository';

@Injectable()
export class EinsatzRepository extends BaseRepository<Einsatz> {
  constructor(@InjectModel(Einsatz.name) readonly model: Model<Einsatz>) {
    super(model, EinsatzRepository.name);
  }

  async anyActive() {
    return (
      (await this.model
        .estimatedDocumentCount({ abgeschlossen: null })
        .exec()) > 0
    );
  }
}
