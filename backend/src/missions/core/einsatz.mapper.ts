import * as packageJson from '../../../package.json';
import { Einsatz } from '../schema/einsatz.schema';
import { EinsatzDto } from './dto/einsatz.dto';
import { SmallMissionDto } from './mission-core.dto';

export class EinsatzMapper {
  toDto(entity: Einsatz): EinsatzDto {
    return {
      id: entity.id,
      nummer: entity.einsatznummer,
      beginn: entity.beginn,
      bearbeiter: entity.bearbeiter,
      alarmstichwort: entity.einsatzAlarmstichwort,
      aufnehmendesRettungsmittel: entity.aufnehmendesRettungsmittel,
      einsatzMeta: entity.einsatzMeta,
    } satisfies EinsatzDto;
  }

  toSmallDto(entity: Einsatz): SmallMissionDto {
    return {
      _id: entity.id,
      backendVersion: entity.backendVersion,
      backendCompatible: this.isVersionCompatible(entity.backendVersion, packageJson.version),
      aufnehmendesRettungsmittel: entity.aufnehmendesRettungsmittel,
      bearbeiter: entity.bearbeiter,
      beginn: entity.beginn.toISOString(),
      ende: entity.ende?.toISOString(),
      einsatzAlarmstichwort: entity.einsatzAlarmstichwort.toObject(),
      einsatzMeta: entity.einsatzMeta,
    } satisfies SmallMissionDto;
  }

  private isVersionCompatible(missionVersion: string, serverVersion: string): boolean {
    if (missionVersion === serverVersion) return true;

    const hasPrerelease = (version?: string) =>
      version?.includes('alpha') || version?.includes('beta');

    if (hasPrerelease(missionVersion) || hasPrerelease(serverVersion)) {
      return false;
    }

    return true;
  }

  toDtoList(entities: Einsatz[]): EinsatzDto[] {
    return entities.map(this.toDto);
  }
}
