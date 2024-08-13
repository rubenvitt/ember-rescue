import { Test, TestingModule } from '@nestjs/testing';
import { NotizenService } from './notizen.service';

describe('NotizenService', () => {
  let service: NotizenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotizenService],
    }).compile();

    service = module.get<NotizenService>(NotizenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
