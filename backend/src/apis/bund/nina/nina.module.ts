import { Module } from '@nestjs/common';
import { NinaController } from './nina.controller';
import { NinaService } from './nina.service';
import { MapModule } from '../../../map/map.module';

@Module({
  controllers: [NinaController],
  providers: [NinaService],
  imports: [MapModule],
})
export class NinaModule {}
