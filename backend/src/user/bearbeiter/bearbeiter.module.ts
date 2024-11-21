import { Module } from '@nestjs/common';
import { BearbeiterCoreModule } from './core/bearbeiter-core.module';

@Module({
  imports: [BearbeiterCoreModule],
  providers: [],
  exports: [BearbeiterCoreModule],
})
export class BearbeiterModule {}
