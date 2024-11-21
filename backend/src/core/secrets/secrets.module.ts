import { Module } from '@nestjs/common';
import { SecretsController } from './secrets.controller';
import { SecretsService } from './secrets.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [SecretsController],
  providers: [SecretsService],
  imports: [DatabaseModule],
  exports: [SecretsService],
})
export class SecretsModule {}
