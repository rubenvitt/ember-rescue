import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { PrismaService } from './prisma/prisma.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URL!!)],
  providers: [...databaseProviders, PrismaService],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
