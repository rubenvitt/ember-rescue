import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { BearbeiterService } from './bearbeiter.service';
import { NewBearbeiterDto } from '@common-dtos/bearbeiter.dto';

@Controller('bearbeiter')
export class BearbeiterController {
  private readonly logger = new Logger(BearbeiterController.name);

  constructor(
    @Inject() private readonly bearbeiterService: BearbeiterService,
  ) {}

  @Get()
  async findAll() {
    this.logger.log(
      'BearbeiterController.findAll(), Environment: ',
      process.env.NODE_ENV,
    );
    return this.bearbeiterService.findAll();
  }

  @Post()
  async login(@Body() bearbeiter: NewBearbeiterDto) {
    this.logger.log(
      'BearbeiterController.login(), Environment: ',
      process.env.NODE_ENV,
      bearbeiter,
    );
    return await this.bearbeiterService.findByNameOrCreate(bearbeiter.name);
  }
}
