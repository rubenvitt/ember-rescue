import { Injectable, Logger } from '@nestjs/common';
import { NullableType } from 'joi';
import { InjectModel } from '@nestjs/mongoose';
import { Secret } from '../core/database/mongo/schemas/secret.schema';
import { Model } from 'mongoose';

@Injectable()
export class SecretsService {
  private readonly logger = new Logger(SecretsService.name);

  constructor(
    @InjectModel(Secret.name) private readonly secretModel: Model<Secret>,
  ) {}

  async save(key: string, value: NullableType<string>): Promise<void> {
    if (!value) {
      this.logger.warn('Removing secret', key);
      this.secretModel.deleteOne({ key });
      return;
    }

    await this.secretModel.updateOne(
      { key },
      { $set: { value: value } },
      { upsert: true },
    );
  }

  async read(key: string): Promise<string | null> {
    return await this.secretModel
      .findOne({ key })
      .then((s) => s?.value || null);
  }
}
