import { Test, TestingModule } from '@nestjs/testing';
import { BearbeiterController } from './bearbeiter.controller';

describe('BearbeiterController', () => {
  let controller: BearbeiterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BearbeiterController],
    }).compile();

    controller = module.get<BearbeiterController>(BearbeiterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
