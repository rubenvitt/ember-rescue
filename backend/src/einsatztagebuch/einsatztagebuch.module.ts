import { Module } from '@nestjs/common';
import { EinsatztagebuchController } from './einsatztagebuch.controller';
import { EinsatztagebuchService } from './einsatztagebuch.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    // MongooseModule.forFeature([
    //   {
    //     name: Einsatz.name,
    //     schema: EinsatzSchema,
    //   },
    // ]),
  ],
  controllers: [EinsatztagebuchController],
  providers: [EinsatztagebuchService],
  exports: [EinsatztagebuchService],
})
export class EinsatztagebuchModule {}
