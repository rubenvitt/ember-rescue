import { Test, TestingModule } from '@nestjs/testing';
import { EinsatzFahrzeugeController } from './einsatz-fahrzeuge.controller';
import { EinsatzFahrzeugeService } from './einsatz-fahrzeuge.service';

describe('EinsatzEinheitenController', () => {
  let controller: EinsatzFahrzeugeController;
  let service: EinsatzFahrzeugeService;

  beforeEach(async () => {
    const serviceMock = {
      findEinheitenImEinsatz: jest.fn().mockResolvedValue([]),
      addEinheitToEinsatz: jest.fn().mockResolvedValue(undefined),
      changeStatus: jest.fn().mockResolvedValue(undefined),
      removeEinheitFromEinsatz: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EinsatzFahrzeugeController],
      providers: [{ provide: EinsatzFahrzeugeService, useValue: serviceMock }],
    }).compile();

    controller = module.get<EinsatzFahrzeugeController>(
      EinsatzFahrzeugeController,
    );
    service = module.get<EinsatzFahrzeugeService>(EinsatzFahrzeugeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find einheiten im einsatz', async () => {
    const einsatzId = 'einsatz1';
    const result = await controller.findEinheitenImEinsatz(einsatzId);
    expect(result).toEqual([]);
    expect(service.findFahrzeugeImEinsatz).toHaveBeenCalledWith({ einsatzId });
  });

  it('should add einheit to einsatz', async () => {
    const einsatzId = 'einsatz1';
    const bearbeiterHeader = 'Bearbeiter-ID: bearbeiter1';
    const body = { einheitId: 'einheit1' };

    const response = await controller.addFahrzeugToEinsatz(
      einsatzId,
      bearbeiterHeader,
      body,
    );
    expect(response).toEqual({ status: 'ok' });
    expect(service.addFahrzeugToEinsatz).toHaveBeenCalledWith(
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
    expect(service.removeFahrzeugFromEinsatz).toHaveBeenCalledWith(
      einheitId,
      einsatzId,
      'bearbeiter1',
    );
  });
});
