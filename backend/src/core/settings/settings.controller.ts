import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsDto, SettingsResponse } from './settings.dto';
import { Response } from 'express';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';

@Controller('core/settings')
@UseGuards(BearbeiterGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOkResponse({
    type: SettingsResponse,
    description: 'Settings of the server.',
  })
  async findSettings(): Promise<SettingsDto> {
    return this.settingsService.findSettings();
  }

  @Post()
  @ApiOkResponse({})
  @ApiBody({
    type: SettingsDto,
    required: true,
  })
  async saveSettings(@Body() settings: SettingsDto, @Res() response: Response) {
    await this.settingsService.saveSettings(settings);
    response.status(200).send({
      message: 'Settings saved',
    });
  }
}
