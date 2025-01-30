import { Einsatz } from '../schema/einsatz.schema';
import { EinsatzDto } from './dto/einsatz.dto';

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

  toDtoList(entities: Einsatz[]): EinsatzDto[] {
    return entities.map(this.toDto);
  }
}
