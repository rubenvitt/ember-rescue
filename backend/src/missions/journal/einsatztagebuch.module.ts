import { Module } from '@nestjs/common';
import { JournalController } from './journal.controller';
import { EinsatztagebuchService } from './einsatztagebuch.service';
import { EinsatzSchemaModule } from '../schema/einsatz-schema.module';

@Module({
  imports: [EinsatzSchemaModule],
  controllers: [JournalController],
  providers: [EinsatztagebuchService],
  exports: [EinsatztagebuchService],
})
export class EinsatztagebuchModule {}
