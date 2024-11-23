import { Module } from '@nestjs/common';
import { EinsatzRepository } from './einsatz.repository';
import { getModelToken, MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { Einsatz } from './einsatz.schema';
import {
  Counter,
  CounterSchema,
} from '@core/database/mongo/schemas/counter.schema';
import { Model } from 'mongoose';

@Module({
  providers: [EinsatzRepository],
  exports: [EinsatzRepository],
  imports: [
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
              next();
            }
          });

          return schema;
        },
        inject: [getModelToken(Counter.name)],
      },
    ]),
  ],
})
export class EinsatzSchemaModule {}
