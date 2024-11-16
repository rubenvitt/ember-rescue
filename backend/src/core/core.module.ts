import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
      }),
      envFilePath: ['.env.development.local', '.dev.env', '.env'],
      isGlobal: true,
    }),
    DatabaseModule,
  ],
  exports: [ConfigModule, DatabaseModule],
})
export class CoreModule {}
