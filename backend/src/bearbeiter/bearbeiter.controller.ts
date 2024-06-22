import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { BearbeiterService } from './bearbeiter.service';

@Controller('bearbeiter')
export class BearbeiterController {
  private readonly logger = new Logger(BearbeiterController.name);

  constructor(@Inject() private readonly bearbeiterService: BearbeiterService) {
  }

  @Get()
  async findAll() {
    this.logger.log('BearbeiterController.findAll(), Environment: ', process.env.NODE_ENV);
    //return this.bearbeiterService.findAll();
    return [{ id: 'test', name: 'anna' }];
  }
}
