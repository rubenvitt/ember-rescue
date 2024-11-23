import { Module } from '@nestjs/common';
import { EinsatztagebuchController } from './einsatztagebuch.controller';
import { EinsatztagebuchService } from './einsatztagebuch.service';
import { EinsatzSchemaModule } from '../schema/einsatz-schema.module';

@Module({
  imports: [EinsatzSchemaModule],
  controllers: [EinsatztagebuchController],
  providers: [EinsatztagebuchService],
  exports: [EinsatztagebuchService],
})
export class EinsatztagebuchModule {}
