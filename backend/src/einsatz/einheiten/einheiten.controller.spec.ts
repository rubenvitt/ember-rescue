import { Test, TestingModule } from '@nestjs/testing';
import { EinsatzEinheitenController } from './einsatz-einheiten.controller';

describe('EinheitenController', () => {
  let controller: EinsatzEinheitenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EinsatzEinheitenController],
    }).compile();

    controller = module.get<EinsatzEinheitenController>(
      EinsatzEinheitenController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
