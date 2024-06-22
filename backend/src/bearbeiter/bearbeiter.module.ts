import { Module } from '@nestjs/common';
import { BearbeiterService } from './bearbeiter.service';
import { bearbeiterProviders } from './bearbeiter.providers';
import { BearbeiterController } from './bearbeiter.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...bearbeiterProviders, BearbeiterService],
  controllers: [BearbeiterController],
})
export class BearbeiterModule {
}
