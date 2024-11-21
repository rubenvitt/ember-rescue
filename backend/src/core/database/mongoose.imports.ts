import { DynamicModule } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { Secret } from './mongo/schemas/secret.schema';
import { Counter, CounterSchema } from './mongo/schemas/counter.schema';
import {
  Bearbeiter,
  BearbeiterSchema,
} from './mongo/schemas/bearbeiter.schema';
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
  ]),
];
