import { Test, TestingModule } from '@nestjs/testing';
import { EinsatzEinheitenController } from './einsatz-einheiten.controller';
import { EinsatzEinheitenService } from './einsatz-einheiten.service';

describe('EinsatzEinheitenController', () => {
  let controller: EinsatzEinheitenController;
  let service: EinsatzEinheitenService;

  beforeEach(async () => {
    const serviceMock = {
      findEinheitenImEinsatz: jest.fn().mockResolvedValue([]),
      addEinheitToEinsatz: jest.fn().mockResolvedValue(undefined),
      changeStatus: jest.fn().mockResolvedValue(undefined),
      removeEinheitFromEinsatz: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EinsatzEinheitenController],
      providers: [{ provide: EinsatzEinheitenService, useValue: serviceMock }],
    }).compile();

    controller = module.get<EinsatzEinheitenController>(
      EinsatzEinheitenController,
    );
    service = module.get<EinsatzEinheitenService>(EinsatzEinheitenService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find einheiten im einsatz', async () => {
    const einsatzId = 'einsatz1';
    const result = await controller.findEinheitenImEinsatz(einsatzId);
    expect(result).toEqual([]);
    expect(service.findEinheitenImEinsatz).toHaveBeenCalledWith({ einsatzId });
  });

  it('should add einheit to einsatz', async () => {
    const einsatzId = 'einsatz1';
    const bearbeiterHeader = 'Bearbeiter-ID: bearbeiter1';
    const body = { einheitId: 'einheit1' };

    const response = await controller.addEinheitToEinsatz(
      einsatzId,
      bearbeiterHeader,
      body,
    );
    expect(response).toEqual({ status: 'ok' });
    expect(service.addEinheitToEinsatz).toHaveBeenCalledWith(
      body.einheitId,
      einsatzId,
      'bearbeiter1',
    );
  });

  it('should change status of einheit in einsatz', async () => {
    const einsatzId = 'einsatz1';
    const einheitId = 'einheit1';
    const bearbeiterHeader = 'Bearbeiter-ID: bearbeiter1';
    const body = { statusId: 'status1' };

    const response = await controller.changeStatus(
      einsatzId,
      einheitId,
      bearbeiterHeader,
      body,
    );
    expect(response).toEqual({ status: 'ok' });
    expect(service.changeStatus).toHaveBeenCalledWith(
      einheitId,
      einsatzId,
      'bearbeiter1',
      { statusId: body.statusId },
    );
  });

  it('should remove einheit from einsatz', async () => {
    const einsatzId = 'einsatz1';
    const einheitId = 'einheit1';
    const bearbeiterHeader = 'Bearbeiter-ID: bearbeiter1';

    const response = await controller.removeFromEinsatz(
      einsatzId,
      einheitId,
      bearbeiterHeader,
    );
    expect(response).toEqual({ status: 'ok' });
    expect(service.removeEinheitFromEinsatz).toHaveBeenCalledWith(
      einheitId,
      einsatzId,
      'bearbeiter1',
    );
  });
});
