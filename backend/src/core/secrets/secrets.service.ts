import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NullableType } from 'joi';
import { Model } from 'mongoose';
import { validateKey } from 'src/utils/validation.utils';
import { Secret } from './secret.schema';

@Injectable()
export class SecretsService {
  private readonly logger = new Logger(SecretsService.name);

  constructor(
    @InjectModel(Secret.name) private readonly secretModel: Model<Secret>,
  ) {}

  async save(key: string, value: NullableType<string>): Promise<void> {
    if (!value) {
      this.logger.warn('Removing secret', key);
      await this.secretModel.deleteOne({ key: validateKey(key) });
      return;
    }

    await this.secretModel.updateOne(
      { key: validateKey(key) },
      { $set: { value: value } },
      { upsert: true },
    );
  }

  async read(key: string): Promise<string | null> {
    return await this.secretModel
      .findOne({ key: validateKey(key) })
      .then((s) => s?.value || null);
  }
}
