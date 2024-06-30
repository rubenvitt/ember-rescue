import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { BearbeiterService } from './bearbeiter.service';
import { NewBearbeiterDto } from '../types';

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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(
      'BearbeiterController.findOne(), Environment: ',
      process.env.NODE_ENV,
      id,
    );
    this.logger.log('BearbeiterController.findOne(), Find one: ', id);

    return this.bearbeiterService.findOne(id);
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
