import { Module } from '@nestjs/common';
import { EinsatzController } from './einsatz.controller';
import { EinsatzService } from './einsatz.service';
import { DatabaseModule } from '../database/database.module';
import { EinsatzEinheitenModule } from './einheiten/einsatz-einheiten.module';

@Module({
  controllers: [EinsatzController],
  providers: [EinsatzService],
  imports: [DatabaseModule, EinsatzEinheitenModule],
})
export class EinsatzModule {}
