import { Module } from '@nestjs/common';
import { EinsatzCoreModule } from './core/einsatz-core.module';
import { EinsatztagebuchModule } from './einsatztagebuch/einsatztagebuch.module';
import { EinsatzSchemaModule } from './schema/einsatz-schema.module';
import { EinsatzFahrzeugeModule } from './fahrzeuge/einsatz-fahrzeuge.module';
import { NotizenModule } from './notizen/notizen.module';
import { RemindersModule } from './reminders/reminders.module';

@Module({
  exports: [
    EinsatzCoreModule,
    EinsatztagebuchModule,
    EinsatzSchemaModule,
    EinsatzFahrzeugeModule,
  ],
  imports: [
    EinsatzCoreModule,
    EinsatztagebuchModule,
    EinsatzSchemaModule,
    EinsatzFahrzeugeModule,
    NotizenModule,
    RemindersModule,
  ],
})
export class EinsatzModule {}
