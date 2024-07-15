import { Test, TestingModule } from '@nestjs/testing';
import { NinaController } from './nina.controller';

describe('NinaController', () => {
  let controller: NinaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NinaController],
    }).compile();

    controller = module.get<NinaController>(NinaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
