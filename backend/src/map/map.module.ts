import { Module } from '@nestjs/common';
import { GeojsonService } from './geojson/geojson.service';

@Module({
  providers: [GeojsonService],
  exports: [GeojsonService],
})
export class MapModule {}
