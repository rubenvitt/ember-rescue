import { Injectable, Logger } from '@nestjs/common';
import {
  GeoJSONResponse,
  GeojsonService,
  WarningInfo,
} from '../../../map/geojson/geojson.service';

export type WarningSystem =
  | 'katwarn'
  | 'dwd'
  | 'biwapp'
  | 'mowas'
  | 'lhp'
  | 'police';

@Injectable()
export class NinaService {
  private readonly logger = new Logger(NinaService.name);
  private readonly ninaBaseApi = 'https://nina.api.proxy.bund.dev';
  private readonly ninaWarningApi = `${this.ninaBaseApi}/api31/warnings`;
  private readonly warningSystems: Record<WarningSystem, string> = {
    katwarn: `${this.ninaBaseApi}/api31/katwarn`,
    dwd: `${this.ninaBaseApi}/api31/dwd`,
    biwapp: `${this.ninaBaseApi}/api31/biwapp`,
    mowas: `${this.ninaBaseApi}/api31/mowas`,
    lhp: `${this.ninaBaseApi}/api31/lhp`,
    police: `${this.ninaBaseApi}/api31/police`,
  };

  constructor(private readonly geojsonService: GeojsonService) {}

  async fetchWarningsAsGeoJson(): Promise<GeoJSONResponse<unknown>> {
    const allWarnings = await this.fetchAllWarnings();
    this.logger.log(`Found ${allWarnings.length} warnings`);

    const response =
      await this.geojsonService.combineGeoJSONWarnings(allWarnings);
    this.logger.log(
      `Combined GeoJSON with ${response.features.length} features`,
    );

    return response;
  }

  async fetchWarningDetails(warningId: string): Promise<any> {
    const url = `${this.ninaWarningApi}/${warningId}.json`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      this.logger.error(
        `Error fetching warning details for ID ${warningId}:`,
        error,
      );
      throw error;
    }
  }

  async fetchAllWarningDetails(): Promise<any[]> {
    const allWarnings = await this.fetchAllWarnings();
    const warningDetailsPromises = allWarnings.map((warning) =>
      this.fetchWarningDetails(
        warning.id.split('/').pop().replace('.geojson', ''),
      ),
    );

    try {
      const warningDetails = await Promise.all(warningDetailsPromises);
      this.logger.log(`Fetched details for ${warningDetails.length} warnings`);
      return warningDetails;
    } catch (error) {
      this.logger.error('Error fetching all warning details:', error);
      throw error;
    }
  }

  private async fetchAllWarnings(): Promise<WarningInfo[]> {
    const warningPromises = Object.entries(this.warningSystems).map(
      ([type, apiUrl]) =>
        this.fetchWarningsByType(type as WarningSystem, apiUrl),
    );
    const warningsArray = await Promise.all(warningPromises);
    return warningsArray.flat();
  }

  private async fetchWarningsByType(
    type: WarningSystem,
    apiUrl: string,
  ): Promise<WarningInfo[]> {
    try {
      const url = `${apiUrl}/mapData.json`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const warnings = (await response.json()) as { id: string }[];

      return warnings.map((w) => ({
        id: `${this.ninaWarningApi}/${w.id}.geojson`,
        type: type,
      }));
    } catch (error) {
      this.logger.error(`Error fetching ${type} warnings:`, error);
      return [];
    }
  }
}
