import { Test, TestingModule } from '@nestjs/testing';
import { EinsatzService } from './einsatz.service';

describe('EinsatzService', () => {
  let service: EinsatzService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EinsatzService],
    }).compile();

    service = module.get<EinsatzService>(EinsatzService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
