import { Module } from '@nestjs/common';
import { OptaModule } from '@templates/opta/opta.module';
import { QualifikationenModule } from '@templates/qualifications/qualifikationen.module';
import { StatusModule } from '@templates/status/status.module';
import { FahrzeugeModule } from '@templates/vehicles/fahrzeuge.module';
import { AlarmstichwortModule } from './alarmstichworte/alarmstichwort.module';
import { UAVModule } from './uav/uav.module';

@Module({
  exports: [
    AlarmstichwortModule,
    FahrzeugeModule,
    OptaModule,
    QualifikationenModule,
    StatusModule,
    UAVModule,
  ],
  imports: [
    AlarmstichwortModule,
    FahrzeugeModule,
    OptaModule,
    QualifikationenModule,
    StatusModule,
    UAVModule,
  ],
})
export class TemplateModule {}
