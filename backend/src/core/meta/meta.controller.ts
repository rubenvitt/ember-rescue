import { Controller, Get, Logger } from '@nestjs/common';
import { MetaService } from './meta.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { MetaResponse } from '@core/meta/meta.dto';

@Controller('core/meta')
export class MetaController {
  private readonly logger = new Logger(MetaController.name);

  constructor(private readonly metaService: MetaService) {}

  @Get()
  @ApiOkResponse({
    type: MetaResponse,
    description: 'Information about the server.',
  })
  getMeta() {
    return this.metaService.findAppMetadata();
  }
}
