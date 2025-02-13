import { Module } from '@nestjs/common';
import { UAVModule } from '@templates/uav/uav.module';
import { EinsatzCoreModule } from './core/einsatz-core.module';
import { EinsatztagebuchModule } from './journal/einsatztagebuch.module';
import { NotizenModule } from './notes/notizen.module';
import { RemindersModule } from './reminders/reminders.module';
import { EinsatzSchemaModule } from './schema/einsatz-schema.module';
import { UAVMissionController } from './uav-mission.controller';
import { UAVMissionService } from './uav-mission.service';
import { EinsatzFahrzeugeModule } from './vehicles/einsatz-fahrzeuge.module';

@Module({
  exports: [
    EinsatzCoreModule,
    EinsatztagebuchModule,
    EinsatzSchemaModule,
    EinsatzFahrzeugeModule,
    NotizenModule,
    RemindersModule,
  ],
  imports: [
    EinsatzSchemaModule,
    EinsatzCoreModule,
    EinsatztagebuchModule,
    EinsatzFahrzeugeModule,
    NotizenModule,
    RemindersModule,
    UAVModule,
  ],
  controllers: [
    UAVMissionController,
  ],
  providers: [
    UAVMissionService,
  ],
})
export class MissionsModule {}
