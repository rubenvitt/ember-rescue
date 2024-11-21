import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { mongooseImports } from './mongoose.imports';
import { OptaModule } from '@templates/opta/opta.module';
import { TemplateModule } from '@templates/template.module';
import { EinsatzModule } from '../../einsatz/einsatz.module';

@Module({
  imports: [...mongooseImports, OptaModule, TemplateModule, EinsatzModule],
  providers: [SeedService],
  exports: [MongooseModule],
})
export class DatabaseModule {}
