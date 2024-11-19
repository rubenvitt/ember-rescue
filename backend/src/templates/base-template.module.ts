import { Module } from '@nestjs/common';
import { AlarmstichwortModule } from './alarmstichworte/alarmstichwort.module';
import { OptaModule } from '@templates/opta/opta.module';
import { QualifikationenModule } from '@templates/qualifikationen/qualifikationen.module';
import { StatusModule } from '@templates/status/status.module';
import { FahrzeugeModule } from '@templates/fahrzeuge/fahrzeuge.module';

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
export class BaseTemplateModule {}
