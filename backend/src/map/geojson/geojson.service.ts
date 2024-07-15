import { Injectable } from '@nestjs/common';

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

@Injectable()
export class GeojsonService {
  async fetchGeoJSON(url: string): Promise<GeoJSONResponse<unknown>> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as GeoJSONResponse<unknown>;
  }

  async combineGeoJSONWarnings(
    warningIds: string[],
  ): Promise<GeoJSONResponse<unknown>> {
    const geoJSONPromises = warningIds.map((id) => this.fetchGeoJSON(id));
    const geoJSONResponses = await Promise.all(geoJSONPromises);

    const combinedFeatures = geoJSONResponses.flatMap(
      (response) => response.features,
    );

    return {
      type: 'FeatureCollection',
      features: combinedFeatures,
    };
  }
}
