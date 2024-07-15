import { Test, TestingModule } from '@nestjs/testing';
import { NinaService } from './nina.service';

describe('NinaService', () => {
  let service: NinaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NinaService],
    }).compile();

    service = module.get<NinaService>(NinaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
