import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { mongooseImports } from './mongoose.imports';
import { OptaModule } from '@templates/opta/opta.module';
import { TemplateModule } from '@templates/template.module';
import { MissionsModule } from '../../missions/missions.module';

@Module({
  imports: [...mongooseImports, OptaModule, TemplateModule, MissionsModule],
  providers: [SeedService],
  exports: [MongooseModule],
})
export class DatabaseModule {}
