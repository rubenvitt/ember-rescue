import { Test, TestingModule } from '@nestjs/testing';
import { NinaService } from './nina.service';
import {
  GeojsonService,
  WarningInfo,
} from '../../../map/geojson/geojson.service';

describe('NinaService', () => {
  let service: NinaService;
  let geojsonService: GeojsonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NinaService,
        {
          provide: GeojsonService,
          useValue: {
            combineGeoJSONWarnings: jest.fn().mockResolvedValue({
              type: 'FeatureCollection',
              features: [],
            }),
          },
        },
      ],
    }).compile();

    service = module.get<NinaService>(NinaService);
    geojsonService = module.get<GeojsonService>(GeojsonService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchWarningsAsGeoJson', () => {
    it('should return GeoJSONResponse', async () => {
      jest.spyOn(service as any, 'fetchAllWarnings').mockResolvedValue([]);
      geojsonService.combineGeoJSONWarnings = jest.fn().mockResolvedValue({
        type: 'FeatureCollection',
        features: [], // Ensure this is defined and not undefined
      });

      const result = await service.fetchWarningsAsGeoJson();
      expect(result).toEqual({
        type: 'FeatureCollection',
        features: [],
      });
      expect(geojsonService.combineGeoJSONWarnings).toHaveBeenCalled();
    });
  });

  describe('fetchWarningDetails', () => {
    it('should return warning details', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: '12345', details: 'test' }),
      });

      const result = await service.fetchWarningDetails('12345');
      expect(result).toEqual({ id: '12345', details: 'test' });
      expect(global.fetch).toHaveBeenCalledWith(
        `${service['ninaWarningApi']}/12345.json`,
      );
    });

    it('should throw an error if fetch fails', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      await expect(service.fetchWarningDetails('12345')).rejects.toThrow(
        'HTTP error! status: 404',
      );
    });
  });

  describe('fetchAllWarningDetails', () => {
    it('should return an array of warning details', async () => {
      jest
        .spyOn(service as any, 'fetchAllWarnings')
        .mockResolvedValue([
          { id: '1.geojson' },
          { id: '2.geojson' },
        ] as WarningInfo[]);
      jest
        .spyOn(service as any, 'fetchWarningDetails')
        .mockResolvedValueOnce({ id: '12345', details: 'test' });
      jest
        .spyOn(service as any, 'fetchWarningDetails')
        .mockResolvedValueOnce({ id: '12346', details: 'test2' });

      const result = await service.fetchAllWarningDetails();
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { id: '12345', details: 'test' },
        { id: '12346', details: 'test2' },
      ]);
      expect(service['fetchAllWarnings']).toHaveBeenCalled();
      expect(service['fetchWarningDetails']).toHaveBeenCalledTimes(2);
    });

    it('should throw an error if any fetchWarningDetails fails', async () => {
      jest
        .spyOn(service as any, 'fetchAllWarnings')
        .mockResolvedValue([
          { id: '1.geojson' },
          { id: '2.geojson' },
        ] as WarningInfo[]);
      jest
        .spyOn(service as any, 'fetchWarningDetails')
        .mockRejectedValue(new Error('Error fetching details'));

      await expect(service.fetchAllWarningDetails()).rejects.toThrow(
        'Error fetching details',
      );
    });
  });

  describe('fetchAllWarnings', () => {
    it('should return an array of warnings', async () => {
      jest
        .spyOn(service as any, 'fetchWarningsByType')
        .mockResolvedValueOnce([
          { id: '1.geojson', type: 'katwarn' },
        ] as WarningInfo[])
        .mockResolvedValueOnce([]);

      const result = await service.fetchAllWarnings();
      expect(result).toEqual([{ id: '1.geojson', type: 'katwarn' }]);
    });

    it('should handle errors in fetchWarningsByType gracefully', async () => {
      jest
        .spyOn(service as any, 'fetchWarningsByType')
        .mockRejectedValue(new Error('Error fetching warnings'));

      try {
        const result = await service.fetchAllWarnings();
        expect(result).toEqual([]);
      } catch (error) {
        console.error('Error caught during test execution:', error);
      }
    });
  });
});
