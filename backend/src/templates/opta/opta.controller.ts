import { Controller, Get, UseGuards } from '@nestjs/common';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';
import { ApiOkResponse } from '@nestjs/swagger';
import { FunctionOptaRepository } from '@templates/opta/repositories/function-opta.repository';
import {
  ManyBosOptaTemplatesResponse,
  ManyDistrictOptaTemplatesResponse,
  ManyFunctionOptaTemplatesResponse,
  ManyLocalCodeOptaTemplatesResponse,
} from '@templates/opta/dtos/function.dto';
import { DistrictOptaRepository } from '@templates/opta/repositories/district-opta.repository';
import { LocalCodeOptaRepository } from '@templates/opta/repositories/local-code-opta.repository';
import { BosOptaRepository } from '@templates/opta/repositories/bos-opta.repository';

@Controller('templates/opta')
@UseGuards(BearbeiterGuard)
export class OptaController {
  constructor(
    private readonly functionOptaRepository: FunctionOptaRepository,
    private readonly districtOptaRepository: DistrictOptaRepository,
    private readonly localCodeOptaRepository: LocalCodeOptaRepository,
    private readonly bosOptaRepository: BosOptaRepository,
  ) {}

  @Get('/function')
  @ApiOkResponse({
    type: ManyFunctionOptaTemplatesResponse,
  })
  findFunctionOpta() {
    return this.functionOptaRepository.findActive();
  }

  @Get('/district')
  @ApiOkResponse({
    type: ManyDistrictOptaTemplatesResponse,
  })
  findDistrictOpta() {
    return this.districtOptaRepository.findActive();
  }

  @Get('/local-code')
  @ApiOkResponse({
    type: ManyLocalCodeOptaTemplatesResponse,
  })
  findLocalCodeOpta() {
    return this.localCodeOptaRepository.findActive();
  }

  @Get('bos')
  @ApiOkResponse({
    type: ManyBosOptaTemplatesResponse,
  })
  findBosOpta() {
    return this.bosOptaRepository.findActive();
  }
}
