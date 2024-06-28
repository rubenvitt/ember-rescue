import { Controller, Get, Logger, Post } from '@nestjs/common';
import { EinsatztagebuchService } from './einsatztagebuch.service';

@Controller('einsatztagebuch')
export class EinsatztagebuchController {
  private readonly logger = new Logger(EinsatztagebuchController.name);

  constructor(private service: EinsatztagebuchService) {}

  @Get()
  async getEinsatztagebuch() {
    return this.service.getEinsatztagebuch().then((einsatztagebuch) => {
      // produce much more entries for testing purposes
      return einsatztagebuch.concat(
        Array.from({ length: 10000 }, () => ({
          ...einsatztagebuch[0],
          content: (einsatztagebuch[0].content + ' ').repeat(200),
        })),
      );
    });
  }

  @Post()
  async createEinsatztagebuchEintrag() {
    this.logger.log('createEinsatztagebuchEintrag');
    return this.service.createEinsatztagebuchEintrag();
  }
}
