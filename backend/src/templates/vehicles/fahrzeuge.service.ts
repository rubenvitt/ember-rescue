import { Injectable, Logger } from '@nestjs/common';
import { FahrzeugDto, FahrzeugImportDto } from '../../types';
import { FahrzeugeRepository } from '@templates/vehicles/fahrzeuge.repository';
import { ValidationException } from '@core/exceptions/validation.exception';
import { ImportManyFahrzeugeDto } from '@templates/vehicles/fahrzeuge.dto';

@Injectable()
export class FahrzeugeService {
  private readonly logger = new Logger(FahrzeugeService.name);

  constructor(private readonly repository: FahrzeugeRepository) {}

  async findAll(filter?: unknown) {
    return this.repository.findActive();
  }

  updateMany(fahrzeuge: ImportManyFahrzeugeDto) {
    this.logger.debug('updateMany', fahrzeuge);
    return this.repository.upsertMany(fahrzeuge.items);
  }

  findFahrzeug(id: string) {
    return this.repository.findActiveById(id);
  }

  async importFahrzeuge(fahrzeuge: ImportManyFahrzeugeDto) {
    return this.repository.upsertMany(fahrzeuge.items);
  }

  // TODO move this method to OPTA
  private parseFunkrufnameParts(
    fahrzeug:
      | FahrzeugImportDto
      | Omit<FahrzeugDto, 'status' | 'id' | 'optaOrt' | 'optaFunktion'>,
  ) {
    let optaOrt: number | null = null;
    let optaFunktion: number | null = null;
    let optaOrdnung: number | null = null;
    const funkrufnameParts = fahrzeug.funkrufname.split('-');

    if (this.validatePartsOfFunkrufname(funkrufnameParts)) {
      optaOrt =
        funkrufnameParts.length > 1 ? Number(funkrufnameParts[0]) : null;
      optaFunktion =
        funkrufnameParts.length > 1 &&
        !isNaN(Number(funkrufnameParts[1]?.split(' ')[0]))
          ? Number(funkrufnameParts[1]?.split(' ')[0])
          : null;
      optaOrdnung =
        funkrufnameParts.length > 2 &&
        !isNaN(Number(funkrufnameParts[2]?.split(' ')[0]))
          ? Number(funkrufnameParts[2]?.split(' ')[0])
          : null;
    }

    const regex = /\(([^)]+)\)/;
    const match = regex.exec(fahrzeug.funkrufname);
    const maybeLabel = funkrufnameParts.some((part) => isNaN(Number(part)))
      ? match?.[1] || fahrzeug.funkrufname
      : this.extractFunkrufnameLabel(funkrufnameParts)();
    return { optaOrt, optaFunktion, optaOrdnung, maybeLabel };
  }

  private validatePartsOfFunkrufname(funkrufnameParts: string[]) {
    return funkrufnameParts.every(
      (part, index) =>
        !isNaN(Number(part)) ||
        (index === funkrufnameParts.length - 1 &&
          !isNaN(Number(part.split(' ')[0])) &&
          part.includes('(')),
    );
  }

  private extractFunkrufnameLabel(funkrufnameParts: string[]) {
    return function () {
      const part = funkrufnameParts[funkrufnameParts.length - 1];
      if (part.includes(' ')) {
        const regex = /\(([^)]+)\)/;
        const labelMatch = regex.exec(part);
        if (labelMatch) {
          return labelMatch[1];
        } else if (/\w/.test(part)) {
          throw new ValidationException(
            {
              property: 'funkrufname',
              constraints: {
                isFunkrufname: 'funkrufname must be a valid funkrufname',
              },
            },
            {
              property: 'funkrufname',
              value: part,
            },
          );
        }
      }
      return null;
    };
  }
}
