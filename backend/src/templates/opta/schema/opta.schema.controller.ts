import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { BearbeiterGuard } from '../../../user/bearbeiter/core/bearbeiter.guard';

@Controller('templates/opta/schema')
@UseGuards(BearbeiterGuard)
export class OptaSchemaController {
  constructor(
    @Inject(SchemaService) private readonly schemaService: SchemaService,
  ) {}

  @Get('/funktionen/v2')
  async getSchemaFunktionen() {
    return this.schemaService.generateSchemaFunktionen();
  }

  @Get('/bos/v2')
  async getSchemaBos() {
    return this.schemaService.generateSchemaBos();
  }

  @Get('/districts/v2')
  async getSchemaDistricts() {
    return this.schemaService.generateSchemaDistrict();
  }

  @Get('/local-code/v5')
  async getLocalCode() {
    return this.schemaService.generateSchemaLocalCodes();
  }
}
