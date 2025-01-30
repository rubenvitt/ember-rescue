import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Status, StatusSchema } from '@templates/status/status.schema';
import { StatusRepository } from '@templates/status/status.repository';

@Module({
  controllers: [StatusController],
  imports: [
    MongooseModule.forFeature([{ name: Status.name, schema: StatusSchema }]),
  ],
  providers: [StatusService, StatusRepository],
  exports: [StatusService, StatusRepository],
})
export class StatusModule {}
