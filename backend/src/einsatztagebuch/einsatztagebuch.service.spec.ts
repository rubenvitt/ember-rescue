import { Test, TestingModule } from '@nestjs/testing';
import { EinsatztagebuchService } from './einsatztagebuch.service';

describe('EinsatztagebuchService', () => {
  let service: EinsatztagebuchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EinsatztagebuchService],
    }).compile();

    service = module.get<EinsatztagebuchService>(EinsatztagebuchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
