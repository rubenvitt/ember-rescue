import { Test, TestingModule } from '@nestjs/testing';
import { NotizenController } from './notizen.controller';

describe('NotizenController', () => {
  let controller: NotizenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotizenController],
    }).compile();

    controller = module.get<NotizenController>(NotizenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
