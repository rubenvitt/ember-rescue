import { Test, TestingModule } from '@nestjs/testing';
import { EinsatzController } from './einsatz.controller';
import { EinsatzService } from './einsatz.service';
import * as utils from '../utils/header.utils';

describe('EinsatzController', () => {
  let controller: EinsatzController;
  let service: EinsatzService;

  beforeEach(async () => {
    const serviceMock = {
      getEinsatz: jest.fn().mockResolvedValue({}),
      getEinsaetze: jest.fn().mockResolvedValue([]),
      createEinsatz: jest.fn().mockResolvedValue({}),
      closeEinsatz: jest.fn().mockResolvedValue({}),
    };

    jest
      .spyOn(utils, 'extractBearbeiterId')
      .mockImplementation((headerValue: string) => headerValue);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EinsatzController],
      providers: [{ provide: EinsatzService, useValue: serviceMock }],
    }).compile();

    controller = module.get<EinsatzController>(EinsatzController);
    service = module.get<EinsatzService>(EinsatzService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get einsatz by id', async () => {
    const id = 'einsatz1';
    const result = await controller.getEinsatz(id);
    expect(result).toEqual({});
    expect(service.getEinsatz).toHaveBeenCalledWith(id);
  });

  it('should get einsaetze', async () => {
    const result = await controller.getEinsaetze(true);
    expect(result).toEqual([]);
    expect(service.getEinsaetze).toHaveBeenCalledWith({
      abgeschlossen: { not: null },
    });
  });

  it('should create einsatz', async () => {
    const bearbeiterHeader = 'bearbeiter1';
    const body = {
      aufnehmendesRettungsmittel: 'rettungsmittel1',
      alarmstichwort: 'alarmstichwort1',
      erstAlarmiert: 'erstAlarmiert1',
    };

    const result = await controller.createEinsatz(bearbeiterHeader, body);
    expect(result).toEqual({});

    // Service Mock korrekten Aufruf überprüfen
    const createEinsatzArgs = (service.createEinsatz as jest.Mock).mock
      .calls[0][0];

    // Überprüfen, ob die übergebenen Argumente korrekt sind
    expect(createEinsatzArgs.bearbeiter.connect.id).toBe(bearbeiterHeader);
    expect(createEinsatzArgs.aufnehmendes_rettungsmittel.connect.id).toBe(
      body.aufnehmendesRettungsmittel,
    );
    expect(
      createEinsatzArgs.einsatz_alarmstichwort.create.alarmstichwortId,
    ).toBe(body.alarmstichwort);

    // Überprüfen, ob der Zeitstempel innerhalb eines tolerierbaren Unterschieds ist (hier z.B. 5ms)
    const now = new Date().getTime();
    const beginnTime = new Date(createEinsatzArgs.beginn).getTime();
    expect(Math.abs(now - beginnTime)).toBeLessThanOrEqual(10);
  });

  it('should close einsatz', async () => {
    const einsatzId = 'einsatz1';
    const bearbeiterId = 'bearbeiter1';
    const result = await controller.closeEinsatz(bearbeiterId, einsatzId);
    expect(result).toEqual({});
    expect(service.closeEinsatz).toHaveBeenCalledWith(einsatzId);
  });
});
