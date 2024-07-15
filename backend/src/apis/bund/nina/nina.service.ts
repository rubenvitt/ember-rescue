import { Injectable, Logger } from '@nestjs/common';
import { GeojsonService } from '../../../map/geojson/geojson.service';
import { ensureSlashBetween } from '../../../utils/http.utils';

@Injectable()
export class NinaService {
  private readonly logger = new Logger(NinaService.name);
  private readonly ninaBaseApi = 'https://nina.api.proxy.bund.dev';
  private readonly ninaWarningApi = ensureSlashBetween(
    this.ninaBaseApi,
    '/api31/warnings',
  );
  private readonly ninaKatwarnApi = ensureSlashBetween(
    this.ninaBaseApi,
    '/api31/katwarn',
  );

  constructor(private readonly geojsonService: GeojsonService) {}

  async fetchWarnings() {
    const warningIds = (
      (await fetch(
        ensureSlashBetween(this.ninaKatwarnApi, '/mapData.json'),
      ).then(async (res) => res.json())) as [{ id: string }]
    ).map((w) => ensureSlashBetween(this.ninaWarningApi, w.id + '.geojson'));

    this.logger.log('found warnIds', warningIds);
    const response =
      await this.geojsonService.combineGeoJSONWarnings(warningIds);

    this.logger.log('combined geojson', response);
    return response;
  }
}
