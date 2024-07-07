import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { SecretsModule } from '../secrets/secrets.module';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
  imports: [SecretsModule],
})
export class SettingsModule {}
