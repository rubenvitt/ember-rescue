import { MetaModule } from '@core/meta/meta.module';
import { SettingsModule } from '@core/settings/settings.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from './database/database.module';
import { ExceptionsModule } from './exceptions/exceptions.module';

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
          .custom((value) => {
            if (value.includes('user:pass@')) {
              throw new Error('MONGODB_URL must not contain default credentials user:pass');
            }
            const pattern = /^mongodb:\/\/([^:]+):([^@]+)@([^:\/]+)(:[0-9]+)?(\/[^?]+)(\?.*)?$/;
            if (!pattern.test(value)) {
              throw new Error('MONGODB_URL must be a valid url with the following format: mongodb://<user>:<password>@<host>:<port>/<database>?<options>');
            }
            return value;
          }, 'MongoDB URL validation'),
        otherwise: Joi.string().pattern(
          /^mongodb:\/\/([^:]+):([^@]+)@([^:\/]+)(:[0-9]+)?(\/[^?]+)(\?.*)?$/,
        ),
      })
      .required(),
  }),
  envFilePath: ['.env.development.local', '.dev.env', '.env'],
  isGlobal: true,
});

@Module({
  imports: [
    configModule,
    DatabaseModule,
    SettingsModule,
    MetaModule,
    ExceptionsModule,
  ],
  exports: [ConfigModule, DatabaseModule],
})
export class CoreModule {}
