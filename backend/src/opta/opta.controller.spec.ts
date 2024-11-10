import { Test, TestingModule } from '@nestjs/testing';
import { OptaController } from './opta.controller';

describe('OptaController', () => {
  let controller: OptaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptaController],
    }).compile();

    controller = module.get<OptaController>(OptaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
