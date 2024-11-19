import { Module } from '@nestjs/common';
import { AlarmstichwortModule } from './alarmstichworte/alarmstichwort.module';
import { OptaModule } from '@templates/opta/opta.module';
import { QualifikationenModule } from '@templates/qualifikationen/qualifikationen.module';
import { StatusModule } from '@templates/status/status.module';

@Module({
  exports: [
    AlarmstichwortModule,
    OptaModule,
    QualifikationenModule,
    StatusModule,
  ],
  imports: [
    AlarmstichwortModule,
    OptaModule,
    QualifikationenModule,
    StatusModule,
  ],
})
export class BaseTemplateModule {}
