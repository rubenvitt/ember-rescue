import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { BearbeiterModule } from './bearbeiter/bearbeiter.module';
import { ConfigModule } from '@nestjs/config';
import { EinsatztagebuchModule } from './einsatztagebuch/einsatztagebuch.module';
import * as Joi from 'joi';

@Module({
  imports: [
    DatabaseModule,
    BearbeiterModule,
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
    EinsatztagebuchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
