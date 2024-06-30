import { Test, TestingModule } from '@nestjs/testing';
import { QualifikationenService } from './qualifikationen.service';

describe('QualifikationenService', () => {
  let service: QualifikationenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QualifikationenService],
    }).compile();

    service = module.get<QualifikationenService>(QualifikationenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
