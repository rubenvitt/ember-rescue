import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { mongooseImports } from './mongoose.imports';
import { OptaModule } from '@templates/opta/opta.module';
import { BaseTemplateModule } from '@templates/base-template.module';

@Module({
  imports: [...mongooseImports, OptaModule, BaseTemplateModule],
  providers: [SeedService],
  exports: [MongooseModule],
})
export class DatabaseModule {}
