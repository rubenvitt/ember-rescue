import { Test, TestingModule } from '@nestjs/testing';
import { QualifikationenController } from './qualifikationen.controller';

describe('QualifikationenController', () => {
  let controller: QualifikationenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QualifikationenController],
    }).compile();

    controller = module.get<QualifikationenController>(QualifikationenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
