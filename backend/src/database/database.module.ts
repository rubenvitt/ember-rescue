import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { PrismaService } from './prisma/prisma.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import {
  Alarmstichwort,
  AlarmstichwortSchema,
} from './mongo/schemas/alarmstichwort.schema';
import {
  BaseOptaEntry,
  BaseOptaEntrySchema,
} from './mongo/schemas/opta/entry.schema';
import { Opta, OptaSchema } from './mongo/schemas/opta.schema';
import { Status, StatusSchema } from './mongo/schemas/status.schema';
import { Secret, SecretSchema } from './mongo/schemas/secret.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL!!),
    MongooseModule.forFeature([
      // TODO: these imports must be moved to the services
      { name: Alarmstichwort.name, schema: AlarmstichwortSchema },
      {
        name: BaseOptaEntry.mongoName,
        schema: BaseOptaEntrySchema,
      },
      {
        name: Opta.name,
        schema: OptaSchema,
      },
      { name: Status.name, schema: StatusSchema },
      { name: Secret.name, schema: SecretSchema },
    ]),
  ],
  providers: [...databaseProviders, PrismaService, SeedService],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
