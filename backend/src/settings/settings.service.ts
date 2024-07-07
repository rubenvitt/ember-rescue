import { Injectable, Logger } from '@nestjs/common';
import { SecretsService } from '../secrets/secrets.service';
import { SettingsDto } from './settings.dto';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(private readonly secretsService: SecretsService) {}

  async saveSettings(settings: SettingsDto) {
    await this.secretsService.save('mapboxApi', settings.mapboxApi);
  }

  async findSettings(): Promise<SettingsDto> {
    return {
      mapboxApi: await this.secretsService.read('mapboxApi'),
    };
  }
}
