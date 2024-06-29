import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { PrismaService } from './prisma/prisma.service';

@Module({
  providers: [...databaseProviders, PrismaService],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
