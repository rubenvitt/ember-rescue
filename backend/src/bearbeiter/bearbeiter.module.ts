import { Module } from '@nestjs/common';
import { BearbeiterService } from './bearbeiter.service';
import { BearbeiterController } from './bearbeiter.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [BearbeiterService],
  controllers: [BearbeiterController],
})
export class BearbeiterModule {}
