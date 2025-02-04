import {
  Counter,
  CounterSchema,
} from '@core/database/mongo/schemas/counter.schema';
import { MetaModule } from '@core/meta/meta.module';
import { Logger, Module } from '@nestjs/common';
import { getModelToken, MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as packageJson from '../../../package.json';
import { EinsatzRepository } from './einsatz.repository';
import { Einsatz } from './einsatz.schema';

@Module({
  providers: [EinsatzRepository],
  exports: [EinsatzRepository],
  imports: [
    MetaModule,
    MongooseModule.forFeatureAsync([
      {
        name: Einsatz.name,
        imports: [
          MongooseModule.forFeature([
            { name: Counter.name, schema: CounterSchema },
          ]),
        ],
        useFactory: async (counterModel: Model<Counter>) => {
          let schema = SchemaFactory.createForClass(Einsatz);

          schema.pre('save', async function (next) {
            if (this.isNew) {
              const counter = await counterModel.findOneAndUpdate(
                { name: 'einsatznummer' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true },
              );

              this.einsatznummer = counter.seq;
              Logger.log('Create Einsatz', { einsatznummer: this.einsatznummer, backendVersion: packageJson.version });
              this.backendVersion = packageJson.version;
            }

            next();
          });
          return schema;
        },
        inject: [getModelToken(Counter.name)],
      },
    ]),
  ],
})
export class EinsatzSchemaModule {}
