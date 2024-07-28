import { Test, TestingModule } from '@nestjs/testing';
import { EinsatztagebuchController } from './einsatztagebuch.controller';
import { EinsatztagebuchService } from './einsatztagebuch.service';
import * as utils from '../utils/header.utils';
import { CreateEinsatztagebuchDto } from '../types';

describe('EinsatztagebuchController', () => {
  let controller: EinsatztagebuchController;
  let service: EinsatztagebuchService;

  beforeEach(async () => {
    const serviceMock = {
      getEinsatztagebuch: jest.fn().mockResolvedValue([]),
      createEinsatztagebuchEintrag: jest
        .fn()
        .mockResolvedValue({ id: 'eintrag1' }),
      archiveEinsatztagebuchEintrag: jest
        .fn()
        .mockResolvedValue({ id: 'eintrag1', archived: true }),
    };

    jest
      .spyOn(utils, 'extractBearbeiterId')
      .mockImplementation((headerValue: string) => headerValue);
    jest
      .spyOn(utils, 'extractEinsatzId')
      .mockImplementation((headerValue: string) => headerValue);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EinsatztagebuchController],
      providers: [{ provide: EinsatztagebuchService, useValue: serviceMock }],
    }).compile();

    controller = module.get<EinsatztagebuchController>(
      EinsatztagebuchController,
    );
    service = module.get<EinsatztagebuchService>(EinsatztagebuchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get einsatztagebuch', async () => {
    const result = await controller.getEinsatztagebuch(
      'bearbeiter1',
      'einsatz1',
    );
    expect(result).toEqual([]);
    expect(service.getEinsatztagebuch).toHaveBeenCalledWith('einsatz1');
  });

  it('should create einsatztagebuch eintrag', async () => {
    const dto: CreateEinsatztagebuchDto = {
      content: 'Eintrag Test',
      absender: 'Absender Test',
      empfaenger: 'Empfaenger Test',
      timestamp: new Date().toISOString().substr(0, 19), // Format: YYYY-MM-DDTHH:mm:ss
      type: 'USER',
    };

    const result = await controller.createEinsatztagebuchEintrag(
      'bearbeiter1',
      'einsatz1',
      dto,
    );
    expect(result).toEqual({ id: 'eintrag1' });
    expect(service.createEinsatztagebuchEintrag).toHaveBeenCalledWith({
      bearbeiterId: 'bearbeiter1',
      einsatzId: 'einsatz1',
      ...dto,
    });
  });

  it('should archive einsatztagebuch eintrag', async () => {
    const id = 'eintrag1';
    const result = await controller.archiveEinsatztagebuchEintrag(id);
    expect(result).toEqual({ id, archived: true });
    expect(service.archiveEinsatztagebuchEintrag).toHaveBeenCalledWith(id);
  });
});
