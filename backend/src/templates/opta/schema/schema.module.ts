import { Module } from '@nestjs/common';
import { OptaSchemaController } from './opta.schema.controller';
import { SchemaService } from './schema.service';

@Module({
  controllers: [OptaSchemaController],
  providers: [SchemaService],
})
export class SchemaModule {}
