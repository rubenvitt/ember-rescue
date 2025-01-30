import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { BearbeiterCoreService } from './bearbeiter-core.service';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import {
  BearbeiterDto,
  CreateBearbeiterDto,
  ManyBearbeiterResponse,
  OneBearbeiterResponse,
} from './bearbeiter.dto';

@Controller('users')
export class BearbeiterCoreController {
  private readonly logger = new Logger(BearbeiterCoreController.name);

  constructor(
    @Inject() private readonly bearbeiterService: BearbeiterCoreService,
  ) {}

  @Get()
  @ApiOkResponse({
    type: ManyBearbeiterResponse,
    description: 'Returns all bearbeiter',
  })
  async findAll(): Promise<BearbeiterDto[]> {
    this.logger.debug(`Searching for all bearbeiter`);
    return this.bearbeiterService.findAll();
  }

  @Get(':name')
  @ApiOkResponse({
    type: OneBearbeiterResponse,
    description: 'Returns a bearbeiter',
  })
  async findOne(@Param('name') name: string) {
    this.logger.debug(`Searching for bearbeiter with name: ${name}`);

    return this.bearbeiterService.findOne(name);
  }

  @Post()
  @ApiBody({
    type: CreateBearbeiterDto,
    required: true,
    description: 'Create a new bearbeiter',
  })
  @ApiOkResponse({
    type: OneBearbeiterResponse,
    description: 'Returns a bearbeiter',
  })
  async login(@Body() bearbeiter: CreateBearbeiterDto) {
    this.logger.debug(`Searching for bearbeiter with name: ${bearbeiter.name}`);
    return await this.bearbeiterService.findByNameOrCreate(bearbeiter.name);
  }
}
