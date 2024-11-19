import { Module } from '@nestjs/common';
import { AlarmstichwortModule } from './alarmstichworte/alarmstichwort.module';
import { OptaModule } from '@templates/opta/opta.module';
import { QualifikationenModule } from '@templates/qualifikationen/qualifikationen.module';

@Module({
  exports: [AlarmstichwortModule, OptaModule, QualifikationenModule],
  imports: [AlarmstichwortModule, OptaModule, QualifikationenModule],
})
export class BaseTemplateModule {}
