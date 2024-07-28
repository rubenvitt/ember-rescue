import { Test, TestingModule } from '@nestjs/testing';
import { NinaController } from './nina.controller';
import { NinaService } from './nina.service';

describe('NinaController', () => {
  let controller: NinaController;
  let ninaService: NinaService;

  beforeEach(async () => {
    const ninaServiceMock = {
      fetchWarningsAsGeoJson: jest
        .fn()
        .mockResolvedValue({ type: 'FeatureCollection', features: [] }),
      fetchWarningDetails: jest
        .fn()
        .mockResolvedValue({ id: '12345', details: 'test' }),
      fetchAllWarningDetails: jest.fn().mockResolvedValue([
        { id: '12345', details: 'test' },
        {
          id: '12346',
          details: 'test2',
        },
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NinaController],
      providers: [{ provide: NinaService, useValue: ninaServiceMock }],
    }).compile();

    controller = module.get<NinaController>(NinaController);
    ninaService = module.get<NinaService>(NinaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return GeoJSON data', async () => {
    const result = await controller.getGeoJson();
    expect(result).toEqual({ type: 'FeatureCollection', features: [] });
    expect(ninaService.fetchWarningsAsGeoJson).toHaveBeenCalled();
  });

  it('should return warning details for a given id', async () => {
    const result = await controller.getWarningDetails('12345');
    expect(result).toEqual({ id: '12345', details: 'test' });
    expect(ninaService.fetchWarningDetails).toHaveBeenCalledWith('12345');
  });

  it('should return all warning details', async () => {
    const result = await controller.getAllWarningDetails();
    expect(result).toEqual([
      { id: '12345', details: 'test' },
      { id: '12346', details: 'test2' },
    ]);
    expect(ninaService.fetchAllWarningDetails).toHaveBeenCalled();
  });
});
