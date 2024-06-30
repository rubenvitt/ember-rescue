import { Test, TestingModule } from '@nestjs/testing';
import { EinheitenController } from './einheiten.controller';

describe('EinheitenController', () => {
  let controller: EinheitenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EinheitenController],
    }).compile();

    controller = module.get<EinheitenController>(EinheitenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
