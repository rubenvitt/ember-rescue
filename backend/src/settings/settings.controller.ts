import { Body, Controller, Get, Post } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsDto } from './settings.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async findSettings() {
    return this.settingsService.findSettings();
  }

  @Post()
  async saveSettings(@Body() settings: SettingsDto) {
    await this.settingsService.saveSettings(settings);
  }
}
