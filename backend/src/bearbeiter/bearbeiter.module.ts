import { Module } from '@nestjs/common';
import { BearbeiterService } from './bearbeiter.service';
import { BearbeiterController } from './bearbeiter.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Bearbeiter,
  BearbeiterSchema,
} from '@core/database/mongo/schemas/bearbeiter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bearbeiter.name, schema: BearbeiterSchema },
    ]),
  ],
  providers: [BearbeiterService],
  exports: [BearbeiterService],
  controllers: [BearbeiterController],
})
export class BearbeiterModule {}
