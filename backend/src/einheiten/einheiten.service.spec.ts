import { Test, TestingModule } from '@nestjs/testing';
import { EinheitenService } from './einheiten.service';

describe('EinheitenService', () => {
  let service: EinheitenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EinheitenService],
    }).compile();

    service = module.get<EinheitenService>(EinheitenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
