import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { getModelToken, MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import {
  Alarmstichwort,
  AlarmstichwortSchema,
} from './mongo/schemas/alarmstichwort.schema';
import {
  BaseOptaEntry,
  BaseOptaEntrySchema,
} from './mongo/schemas/opta/entry.schema';
import { Opta, OptaSchema } from './mongo/schemas/opta.schema';
import { Status, StatusSchema } from './mongo/schemas/status.schema';
import { Secret, SecretSchema } from './mongo/schemas/secret.schema';
import {
  Bearbeiter,
  BearbeiterSchema,
} from './mongo/schemas/bearbeiter.schema';
import { Counter, CounterSchema } from './mongo/schemas/counter.schema';
import { Einsatz } from './mongo/schemas/einsatz.schema';
import { Model } from 'mongoose';
import { Fahrzeug, FahrzeugSchema } from './mongo/schemas/fahrzeug.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL!!),
    MongooseModule.forFeature([
      // TODO: these imports must be moved to the services
      { name: Alarmstichwort.name, schema: AlarmstichwortSchema },
      {
        name: BaseOptaEntry.mongoName,
        schema: BaseOptaEntrySchema,
      },
      {
        name: Fahrzeug.name,
        schema: FahrzeugSchema,
      },
      {
        name: Opta.name,
        schema: OptaSchema,
      },
      { name: Status.name, schema: StatusSchema },
      { name: Secret.name, schema: SecretSchema },
      { name: Counter.name, schema: CounterSchema },
      { name: Bearbeiter.name, schema: BearbeiterSchema },
    ]),
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
  providers: [...databaseProviders, SeedService],
  exports: [...databaseProviders, MongooseModule],
})
export class DatabaseModule {}
