import { Controller, Get, Logger, Post } from '@nestjs/common';
import { EinsatztagebuchService } from './einsatztagebuch.service';

@Controller('einsatztagebuch')
export class EinsatztagebuchController {
  private readonly logger = new Logger(EinsatztagebuchController.name);

  constructor(private service: EinsatztagebuchService) {}

  @Get()
  async getEinsatztagebuch() {
    return this.service.getEinsatztagebuch();
  }

  @Post()
  async createEinsatztagebuchEintrag() {
    this.logger.log('createEinsatztagebuchEintrag');
    return this.service.createEinsatztagebuchEintrag();
  }
}
