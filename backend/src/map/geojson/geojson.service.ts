import { Injectable, Logger } from '@nestjs/common';
import { WarningSystem } from '../../apis/bund/nina/nina.service';

export interface GeoJSONFeature<T> {
  type: 'Feature';
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  properties: T;
  id: string;
}

export interface GeoJSONResponse<T> {
  type: 'FeatureCollection';
  features: GeoJSONFeature<T>[];
}

export interface WarningInfo {
  id: string;
  type: WarningSystem;
}

@Injectable()
export class GeojsonService {
  private readonly logger = new Logger(GeojsonService.name);

  async fetchGeoJSON(url: string): Promise<GeoJSONResponse<any>> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return (await response.json()) as GeoJSONResponse<unknown>;
    } catch (error) {
      this.logger.error(`Error fetching GeoJSON from ${url}:`, error);
      throw error;
    }
  }

  async combineGeoJSONWarnings(
    warningInfos: WarningInfo[],
  ): Promise<GeoJSONResponse<unknown>> {
    const geoJSONPromises = warningInfos.map((info) =>
      this.fetchGeoJSON(info.id)
        .then((response) => ({ response, type: info.type }))
        .catch((error) => {
          this.logger.warn(
            `Failed to fetch GeoJSON for warning ${info.id}:`,
            error,
          );
          return null;
        }),
    );

    const geoJSONResults = (await Promise.all(geoJSONPromises)).filter(
      (result) => result !== null,
    );

    const combinedFeatures = geoJSONResults.flatMap(({ response, type }) =>
      response.features.map((feature) => ({
        ...feature,
        properties: {
          ...feature.properties,
          warningType: type,
        },
      })),
    );

    return {
      type: 'FeatureCollection',
      features: combinedFeatures,
    };
  }
}
