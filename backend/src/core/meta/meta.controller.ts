import { Controller, Get, Logger } from '@nestjs/common';
import { MetaService } from './meta.service';

@Controller('core/meta')
export class MetaController {
  private readonly logger = new Logger(MetaController.name);

  constructor(private readonly metaService: MetaService) {}

  @Get()
  getMeta() {
    return this.metaService.findAppMetadata();
  }
}
