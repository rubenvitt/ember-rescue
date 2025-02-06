import { CacheKey } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus, Logger,
  Param,
  Patch,
  Post,
  Res,
  UseGuards
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { FunctionOptaRepository } from '@templates/opta/repositories/function-opta.repository';
import {
  FahrzeugTemplateDto,
  ImportManyFahrzeugeDto,
  ManyFahrzeugeTemplateResponse,
  ManyFahrzeugTypResponse,
} from '@templates/vehicles/fahrzeuge.dto';
import { Response } from 'express';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';
import { FahrzeugeService } from './fahrzeuge.service';

@Controller('templates/vehicles')
@UseGuards(BearbeiterGuard)
export class VehiclesController {
  private readonly logger = new Logger(VehiclesController.name);

  constructor(
    private readonly fahrzeugeService: FahrzeugeService,
    private readonly functionOptaRepository: FunctionOptaRepository,
    // @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Get()
  @CacheKey('vehicles')
  @ApiOkResponse({
    type: ManyFahrzeugeTemplateResponse,
    description: 'List of all vehicles (templates)',
  })
  findAll(): Promise<FahrzeugTemplateDto[]> {
    return this.fahrzeugeService.findAll();
  }

  @Get('/typen')
  @ApiOkResponse({
    type: ManyFahrzeugTypResponse,
    description: 'List of all vehicles (templates)',
  })
  /**
   * @deprecated
   */
  async findAllTypen() {
    // FIXME[ember-rescue-68](rubeen, 14.11.24): Typen sind jetzt OPTAs

    const optas = await this.functionOptaRepository.findActive({});

    return optas;
  }

  @Patch()
  @ApiBody({
    type: ImportManyFahrzeugeDto,
    description: 'Update many vehicles',
  })
  async updateMany(
    @Body() fahrzeuge: ImportManyFahrzeugeDto,
    @Res() response: Response,
  ) {
    await this.fahrzeugeService.updateMany(fahrzeuge);
    // await this.cacheManager.del('vehicles');
    response.status(HttpStatus.OK);
    response.send({ status: 'Fahrzeuge updated successfully' });
  }

  @Delete(':vehicleId')
  @ApiOkResponse({
    description: 'Delete a vehicle template by id',
  })
  @ApiParam({
    name: 'vehicleId',
    required: true,
    type: String,
    description: 'Fahrzeug ID',
  })
  async deleteVehicle(@Param('vehicleId') vehicleId: string) {
    await this.fahrzeugeService.deleteVehicle(vehicleId);
    // await this.cacheManager.del('vehicles');
  }

  @Get('/import/schema/v2')
  async getImportSchema() {
    // FIXME[ember-rescue-68](rubeen, 14.11.24): Typen
    let fahrzeugTypen = [];
    return fahrzeugTypen;
    //return createFahrzeugSchema(fahrzeugTypen.map((typ) => typ.label));
  }

  @Post('/import')
  @ApiBody({
    type: ImportManyFahrzeugeDto,
    description: 'Import many vehicles',
  })
  async importFahrzeuge(
    @Body() fahrzeuge: ImportManyFahrzeugeDto,
    @Res() response: Response,
  ) {
    this.logger.debug(
      'Importing fahrzeuge',
      JSON.stringify(fahrzeuge, null, 2),
    );
    await this.fahrzeugeService.importFahrzeuge(fahrzeuge);
    response.status(HttpStatus.OK);
    response.send({ status: 'Fahrzeuge updated successfully' });
  }
}
