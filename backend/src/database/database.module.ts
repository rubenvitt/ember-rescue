import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { mongooseImports } from './mongoose.imports';

@Module({
  imports: [...mongooseImports],
  providers: [SeedService],
  exports: [MongooseModule],
})
export class DatabaseModule {}
