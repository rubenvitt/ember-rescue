import { DynamicModule } from '@nestjs/common';
import { getModelToken, MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { Secret } from './mongo/schemas/secret.schema';
import { Counter, CounterSchema } from './mongo/schemas/counter.schema';
import {
  Bearbeiter,
  BearbeiterSchema,
} from './mongo/schemas/bearbeiter.schema';
import { Notiz, NotizSchema } from './mongo/schemas/einsatz/notiz.schema';
import {
  Reminder,
  ReminderSchema,
} from './mongo/schemas/einsatz/reminder.schema';
import { Einsatz } from './mongo/schemas/einsatz.schema';
import { Model } from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from '@core';
import { createEncryptedSchema } from '../../utils/crypt.utils';

export const mongooseImports: DynamicModule[] = [
  MongooseModule.forRootAsync({
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>(config.mongoDBUrl),
    }),
    inject: [ConfigService],
  }),
  MongooseModule.forFeature([
    // TODO: these imports must be moved to the services
    { name: Counter.name, schema: CounterSchema },
    { name: Bearbeiter.name, schema: BearbeiterSchema },
    { name: Notiz.name, schema: NotizSchema },
    { name: Reminder.name, schema: ReminderSchema },
  ]),
  MongooseModule.forFeatureAsync([
    {
      name: Secret.name,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const SecretSchema = SchemaFactory.createForClass(Secret);

        // Der Aufruf bleibt identisch
        createEncryptedSchema(
          SecretSchema,
          ['value'],
          configService.getOrThrow<string>(config.encryptionKey),
        );

        return SecretSchema;
      },
      inject: [ConfigService],
    },
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
];
