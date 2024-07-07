import { Test, TestingModule } from '@nestjs/testing';
import { AlarmstichwortService } from './alarmstichwort.service';

describe('AlarmstichwortService', () => {
  let service: AlarmstichwortService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlarmstichwortService],
    }).compile();

    service = module.get<AlarmstichwortService>(AlarmstichwortService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
