import { Module } from '@nestjs/common';
import { SchemaModule } from './schema/schema.module';

@Module({
  imports: [SchemaModule],
})
export class OptaModule {}
