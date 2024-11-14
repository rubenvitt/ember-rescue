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
import { CreateBearbeiterDto } from '../types';

@Controller('bearbeiter')
export class BearbeiterController {
  private readonly logger = new Logger(BearbeiterController.name);

  constructor(
    @Inject() private readonly bearbeiterService: BearbeiterService,
  ) {}

  @Get()
  async findAll() {
    this.logger.debug(`Searching for all bearbeiter`);
    return this.bearbeiterService.findAll();
  }

  @Get(':name')
  async findOne(@Param('name') name: string) {
    this.logger.debug(`Searching for bearbeiter with name: ${name}`);

    return this.bearbeiterService.findOne(name);
  }

  @Post()
  async login(@Body() bearbeiter: CreateBearbeiterDto) {
    this.logger.debug(`Searching for bearbeiter with name: ${bearbeiter.name}`);
    return await this.bearbeiterService.findByNameOrCreate(bearbeiter.name);
  }
}
