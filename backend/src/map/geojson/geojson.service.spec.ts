import { Test, TestingModule } from '@nestjs/testing';
import { GeojsonService, WarningInfo } from './geojson.service';

describe('GeojsonService', () => {
  let service: GeojsonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeojsonService],
    }).compile();

    service = module.get<GeojsonService>(GeojsonService);
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchGeoJSON', () => {
    it('should fetch and return GeoJSON data', async () => {
      const mockGeoJSON = {
        type: 'FeatureCollection',
        features: [],
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockGeoJSON,
      }) as jest.Mock;

      const url = 'https://example.com/geojson';
      const result = await service.fetchGeoJSON(url);
      expect(result).toEqual(mockGeoJSON);
      expect(global.fetch).toHaveBeenCalledWith(url);
    });

    it('should throw an error if fetch fails', async () => {
      global.fetch = jest
        .fn()
        .mockRejectedValue(new Error('Failed to fetch')) as jest.Mock;

      const url = 'https://example.com/geojson';
      await expect(service.fetchGeoJSON(url)).rejects.toThrow(
        'Failed to fetch',
      );
    });
  });

  describe('combineGeoJSONWarnings', () => {
    it('should combine multiple GeoJSON warnings into a single response', async () => {
      const mockGeoJSON1 = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [[[0, 0]]] },
            properties: {},
            id: '1',
          },
        ],
      };

      const mockGeoJSON2 = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [[[1, 1]]] },
            properties: {},
            id: '2',
          },
        ],
      };

      global.fetch = jest
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => mockGeoJSON1 })
        .mockResolvedValueOnce({ ok: true, json: async () => mockGeoJSON2 });

      const warningInfos: WarningInfo[] = [
        { id: 'https://example.com/geojson1', type: 'katwarn' as const },
        { id: 'https://example.com/geojson2', type: 'dwd' as const },
      ];

      const result = await service.combineGeoJSONWarnings(warningInfos);
      expect(result).toEqual({
        type: 'FeatureCollection',
        features: [
          {
            ...mockGeoJSON1.features[0],
            properties: {
              ...mockGeoJSON1.features[0].properties,
              warningType: 'katwarn',
            },
          },
          {
            ...mockGeoJSON2.features[0],
            properties: {
              ...mockGeoJSON2.features[0].properties,
              warningType: 'dwd',
            },
          },
        ],
      });
    });

    it('should handle fetch errors gracefully', async () => {
      const mockGeoJSON = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [[[0, 0]]] },
            properties: {},
            id: '1',
          },
        ],
      };

      global.fetch = jest
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => mockGeoJSON })
        .mockRejectedValueOnce(new Error('Failed to fetch'));

      const warningInfos: WarningInfo[] = [
        { id: 'https://example.com/geojson1', type: 'katwarn' as const },
        { id: 'https://example.com/geojson2', type: 'dwd' as const },
      ];

      const result = await service.combineGeoJSONWarnings(warningInfos);
      expect(result).toEqual({
        type: 'FeatureCollection',
        features: [
          {
            ...mockGeoJSON.features[0],
            properties: {
              ...mockGeoJSON.features[0].properties,
              warningType: 'katwarn',
            },
          },
        ],
      });
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should return an empty FeatureCollection if all fetches fail', async () => {
      global.fetch = jest
        .fn()
        .mockRejectedValue(new Error('Failed to fetch')) as jest.Mock;

      const warningInfos: WarningInfo[] = [
        { id: 'https://example.com/geojson1', type: 'katwarn' as const },
        { id: 'https://example.com/geojson2', type: 'dwd' as const },
      ];

      const result = await service.combineGeoJSONWarnings(warningInfos);
      expect(result).toEqual({
        type: 'FeatureCollection',
        features: [],
      });
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should log warnings for failed fetches', async () => {
      const loggerSpy = jest.spyOn(service['logger'], 'warn');
      global.fetch = jest
        .fn()
        .mockRejectedValue(new Error('Failed to fetch')) as jest.Mock;

      const warningInfos: WarningInfo[] = [
        { id: 'https://example.com/geojson1', type: 'katwarn' as const },
        { id: 'https://example.com/geojson2', type: 'dwd' as const },
      ];

      await service.combineGeoJSONWarnings(warningInfos);
      expect(loggerSpy).toHaveBeenCalledTimes(2);
    });
  });
});
