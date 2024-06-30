import { Controller, Get } from '@nestjs/common';
import { QualifikationenService } from './qualifikationen.service';
import { QualifikationDto } from '../types';

@Controller('qualifikationen')
export class QualifikationenController {
  constructor(
    private readonly qualifikationenService: QualifikationenService,
  ) {}

  @Get()
  findAll(): Promise<QualifikationDto[]> {
    return this.qualifikationenService.findAll();
  }
}
