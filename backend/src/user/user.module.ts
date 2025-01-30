import { Module } from '@nestjs/common';
import { BearbeiterModule } from './bearbeiter/bearbeiter.module';

@Module({
  imports: [BearbeiterModule],
  exports: [BearbeiterModule],
})
export class UserModule {}
