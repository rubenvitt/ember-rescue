import { Module } from '@nestjs/common';
import { BearbeiterService } from './bearbeiter.service';
import { BearbeiterController } from './bearbeiter.controller';
import { DatabaseModule } from '../database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Bearbeiter,
  BearbeiterSchema,
} from '../database/mongo/schemas/bearbeiter.schema';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Bearbeiter.name, schema: BearbeiterSchema },
    ]),
  ],
  providers: [BearbeiterService],
  controllers: [BearbeiterController],
})
export class BearbeiterModule {}
