import { Module } from '@nestjs/common';
import { AlarmstichwortModule } from './alarms/alarmstichwort.module';
import { OptaModule } from '@templates/opta/opta.module';

@Module({
  exports: [AlarmstichwortModule, OptaModule],
  imports: [AlarmstichwortModule, OptaModule],
})
export class TemplateBaseModule {}
