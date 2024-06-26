import { Module } from '@nestjs/common';
import { EinsatztagebuchController } from './einsatztagebuch.controller';
import { EinsatztagebuchService } from './einsatztagebuch.service';
import { einsatztagebuchProviders } from './einsatztagebuch.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [EinsatztagebuchController],
  providers: [...einsatztagebuchProviders, EinsatztagebuchService],
})
export class EinsatztagebuchModule {}
