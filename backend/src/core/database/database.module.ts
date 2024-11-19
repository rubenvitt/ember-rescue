import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { mongooseImports } from './mongoose.imports';
import { OptaModule } from '@templates/opta/opta.module';
import { AlarmstichwortModule } from '@templates/alarms/alarmstichwort.module';

@Module({
  imports: [...mongooseImports, OptaModule, AlarmstichwortModule],
  providers: [SeedService],
  exports: [MongooseModule],
})
export class DatabaseModule {}
