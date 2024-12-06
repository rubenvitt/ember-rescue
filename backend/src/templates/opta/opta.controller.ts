import { Controller, Get, UseGuards } from '@nestjs/common';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';
import { ApiOkResponse } from '@nestjs/swagger';
import { FunctionOptaRepository } from '@templates/opta/repositories/function-opta.repository';
import { ManyFunctionOptaTemplatesResponse } from '@templates/opta/dtos/function.dto';

@Controller('templates/opta')
@UseGuards(BearbeiterGuard)
export class OptaController {
  constructor(
    private readonly functionOptaRepository: FunctionOptaRepository,
  ) {}

  @Get('/function')
  @ApiOkResponse({
    type: ManyFunctionOptaTemplatesResponse,
  })
  findFunctionOpta() {
    return this.functionOptaRepository.findActive();
  }
}
