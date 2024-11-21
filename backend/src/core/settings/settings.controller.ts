import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsDto } from './settings.dto';
import { Response } from 'express';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';

@Controller('settings')
@UseGuards(BearbeiterGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async findSettings() {
    return this.settingsService.findSettings();
  }

  @Post()
  async saveSettings(@Body() settings: SettingsDto, @Res() response: Response) {
    await this.settingsService.saveSettings(settings);
    response.status(200).send({
      message: 'Settings saved',
    });
  }
}
