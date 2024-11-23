import { Module } from '@nestjs/common';
import { AlarmstichwortModule } from './alarmstichworte/alarmstichwort.module';
import { OptaModule } from '@templates/opta/opta.module';
import { QualifikationenModule } from '@templates/qualifications/qualifikationen.module';
import { StatusModule } from '@templates/status/status.module';
import { FahrzeugeModule } from '@templates/vehicles/fahrzeuge.module';

@Module({
  exports: [
    AlarmstichwortModule,
    FahrzeugeModule,
    OptaModule,
    QualifikationenModule,
    StatusModule,
  ],
  imports: [
    AlarmstichwortModule,
    FahrzeugeModule,
    OptaModule,
    QualifikationenModule,
    StatusModule,
  ],
})
export class TemplateModule {}
