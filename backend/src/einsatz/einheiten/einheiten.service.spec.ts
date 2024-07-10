import { Test, TestingModule } from '@nestjs/testing';
import { EinsatzEinheitenService } from './einsatz-einheiten.service';

describe('EinheitenService', () => {
  let service: EinsatzEinheitenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EinsatzEinheitenService],
    }).compile();

    service = module.get<EinsatzEinheitenService>(EinsatzEinheitenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
