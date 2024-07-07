import { Test, TestingModule } from '@nestjs/testing';
import { AlarmstichwortController } from './alarmstichwortController';

describe('AlarmstichwortController', () => {
  let controller: AlarmstichwortController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlarmstichwortController],
    }).compile();

    controller = module.get<AlarmstichwortController>(AlarmstichwortController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
