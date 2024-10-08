import { Injectable, Logger } from '@nestjs/common';
import {
  GeoJSONResponse,
  GeojsonService,
  WarningInfo,
} from '../../../map/geojson/geojson.service';

/**
 * Represents a warning system.
 * @typedef {string} WarningSystem
 * @description - The WarningSystem class represents various warning systems used for emergency alerts and notifications.
 * These warning systems include 'katwarn', 'dwd', 'biwapp', 'mowas', 'lhp', and 'police'.
 */
export type WarningSystem =
  | 'katwarn'
  | 'dwd'
  | 'biwapp'
  | 'mowas'
  | 'lhp'
  | 'police';

/**
 * Service class for fetching warnings from the Nina API and manipulating GeoJSON data.
 *
 * @Injectable
 */
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

  /**
   * Fetches warnings as GeoJSON.
   *
   * @returns {Promise<GeoJSONResponse<unknown>>} A promise that resolves to a GeoJSONResponse object.
   */
  public async fetchWarningsAsGeoJson(): Promise<GeoJSONResponse<unknown>> {
    const allWarnings = await this.fetchAllWarnings();
    this.logger.log(`Found ${allWarnings.length} warnings`);

    const response =
      await this.geojsonService.combineGeoJSONWarnings(allWarnings);
    this.logger.log(
      `Combined GeoJSON with ${response.features.length} features`,
    );

    return response;
  }

  /**
   * Fetches warning details for a given warning ID.
   *
   * @param {string} warningId - The ID of the warning.
   * @returns {Promise<any>} - A promise that resolves to the warning details.
   * @throws {Error} - If there is an error in the HTTP request or response.
   */
  public async fetchWarningDetails(warningId: string): Promise<any> {
    // Validate the warningId to ensure it matches the expected format
    const validIdPattern = /^[a-zA-Z0-9_-]+$/;
    if (!validIdPattern.test(warningId)) {
      throw new Error('Invalid warning ID format');
    }
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

  /**
   * Fetches all warning details.
   *
   * @returns {Promise<any[]>} A promise that resolves to an array of warning details.
   */
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

  async fetchAllWarnings(): Promise<WarningInfo[]> {
    const warningPromises = Object.entries(this.warningSystems).map(
      ([type, apiUrl]) =>
        this.fetchWarningsByType(type as WarningSystem, apiUrl),
    );
    const warningsArray = await Promise.all(warningPromises);
    return warningsArray.flat();
  }

  async fetchWarningsByType(
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
