import { Module } from '@nestjs/common';
import { BearbeiterCoreService } from './bearbeiter-core.service';
import { BearbeiterCoreController } from './bearbeiter-core.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bearbeiter, BearbeiterSchema } from './bearbeiter.schema';

@Module({
  providers: [BearbeiterCoreService],
  controllers: [BearbeiterCoreController],
  exports: [BearbeiterCoreService],
  imports: [
    MongooseModule.forFeature([
      { name: Bearbeiter.name, schema: BearbeiterSchema },
    ]),
  ],
})
export class BearbeiterCoreModule {}
