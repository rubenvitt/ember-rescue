import { Test, TestingModule } from '@nestjs/testing';
import { EinheitenController } from './einheiten.controller';
import { EinheitenService } from './einheiten.service';
import { Response } from 'express';
import { EinheitDto, SmallStatusDto } from '../types';

describe('EinheitenController', () => {
  let controller: EinheitenController;
  let einheitenService: EinheitenService;

  beforeEach(async () => {
    const einheitenServiceMock = {
      findAll: jest.fn().mockResolvedValue([
        {
          id: '1',
          funkrufname: 'Funkrufname 1',
          einheitTyp: {
            id: 'typ1',
            label: 'Typ 1',
          },
          kapazitaet: 4,
          istTemporaer: false,
          status: {
            id: 'status1',
            label: 'Status 1',
            code: 'code1',
            bezeichnung: 'Bezeichnung 1',
          } as SmallStatusDto,
        } as EinheitDto,
      ]),
      findTypen: jest.fn().mockResolvedValue(['Type A', 'Type B']),
      updateMany: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EinheitenController],
      providers: [
        { provide: EinheitenService, useValue: einheitenServiceMock },
      ],
    }).compile();

    controller = module.get<EinheitenController>(EinheitenController);
    einheitenService = module.get<EinheitenService>(EinheitenService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all einheiten', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([
      {
        id: '1',
        funkrufname: 'Funkrufname 1',
        einheitTyp: {
          id: 'typ1',
          label: 'Typ 1',
        },
        kapazitaet: 4,
        istTemporaer: false,
        status: {
          id: 'status1',
          label: 'Status 1',
          code: 'code1',
          bezeichnung: 'Bezeichnung 1',
        },
      },
    ]);
    expect(einheitenService.findAll).toHaveBeenCalled();
  });

  it('should return all einheiten types', async () => {
    const result = await controller.findAllTypen();
    expect(result).toEqual(['Type A', 'Type B']);
    expect(einheitenService.findTypen).toHaveBeenCalled();
  });

  it('should update many einheiten and return a 201 response', async () => {
    const response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    const einheiten: Omit<EinheitDto, 'status'>[] = [
      {
        id: '1',
        funkrufname: 'Funkrufname 1',
        einheitTyp: {
          id: 'typ1',
          label: 'Typ 1',
        },
        kapazitaet: 4,
        istTemporaer: false,
      },
    ];

    await controller.updateMany(einheiten, response);

    expect(einheitenService.updateMany).toHaveBeenCalledWith(einheiten);
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.send).toHaveBeenCalledWith({
      status: 'Einheiten updated successfully',
    });
  });
});
