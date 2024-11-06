import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { PrismaService } from './prisma/prisma.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import {
  Alarmstichwort,
  AlarmstichwortSchema,
} from './mongo/schemas/Alarmstichwort.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL!!),
    MongooseModule.forFeature([
      { name: Alarmstichwort.name, schema: AlarmstichwortSchema },
    ]),
  ],
  providers: [...databaseProviders, PrismaService, SeedService],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
