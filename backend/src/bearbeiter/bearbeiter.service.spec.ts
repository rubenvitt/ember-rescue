import { Test, TestingModule } from '@nestjs/testing';
import { BearbeiterService } from './bearbeiter.service';

describe('BearbeiterService', () => {
  let service: BearbeiterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BearbeiterService],
    }).compile();

    service = module.get<BearbeiterService>(BearbeiterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
