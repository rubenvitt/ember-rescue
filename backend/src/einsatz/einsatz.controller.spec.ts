import { Test, TestingModule } from '@nestjs/testing';
import { EinsatzController } from './einsatz.controller';

describe('EinsatzController', () => {
  let controller: EinsatzController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EinsatzController],
    }).compile();

    controller = module.get<EinsatzController>(EinsatzController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
