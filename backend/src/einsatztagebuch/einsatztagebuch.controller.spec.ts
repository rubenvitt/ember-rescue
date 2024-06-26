import { Test, TestingModule } from '@nestjs/testing';
import { EinsatztagebuchController } from './einsatztagebuch.controller';

describe('EinsatztagebuchController', () => {
  let controller: EinsatztagebuchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EinsatztagebuchController],
    }).compile();

    controller = module.get<EinsatztagebuchController>(EinsatztagebuchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
