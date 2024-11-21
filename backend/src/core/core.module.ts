import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import * as Joi from 'joi';
import { SettingsModule } from '@core/settings/settings.module';
import { MetaModule } from '@core/meta/meta.module';

let configModule = ConfigModule.forRoot({
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('production'),
    PORT: Joi.number().default(3000),
    AUTH_TOKEN: Joi.string(),
    VERSION: Joi.string().default('development'),
    ENCRYPTION_KEY: Joi.string().required(),
    MONGODB_URL: Joi.string()
      .when('NODE_ENV', {
        is: Joi.string().not('development', 'test'),
        then: Joi.string()
          .pattern(/^(mongodb:\/\/(?!user:pass@)[^:\/]+(:[0-9]+)?(\/.*)?$)/)
          .message(
            'MONGODB_URL must be a valid url with the following format: mongodb://<user>:<password>@<host>:<port>/<database>?<options> and must not contain default credentials user:pass',
          ),
        otherwise: Joi.string().pattern(
          /^(mongodb:\/\/(([^:]+:[^@]+)@)?[^:\/]+(:[0-9]+)?(\/.*)?$)/,
        ),
      })
      .required(),
  }),
  envFilePath: ['.env.development.local', '.dev.env', '.env'],
  isGlobal: true,
});

@Module({
  imports: [configModule, DatabaseModule, SettingsModule, MetaModule],
  exports: [ConfigModule, DatabaseModule],
})
export class CoreModule {}
