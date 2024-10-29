import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { FahrzeugDto, FahrzeugImportDto } from '../types';
import { Prisma } from '@prisma/client';

@Injectable()
export class FahrzeugeService {
  private readonly logger = new Logger(FahrzeugeService.name);

  constructor(private readonly prismaService: PrismaService) {}

  findAll(filter?: Prisma.FahrzeugWhereInput) {
    return this.prismaService.fahrzeug.findMany({
      where: filter,
      include: {
        _count: {
          select: {
            einsatz_fahrzeug: true,
          },
        },
        status: {
          select: {
            id: true,
            bezeichnung: true,
            beschreibung: false,
            code: true,
          },
        },
        optaFunktion: {
          select: {
            id: true,
            label: true,
            optaCode: true,
          },
        },
        optaOrt: {
          select: {
            id: true,
            label: true,
            optaCode: true,
          },
        },
      },
      orderBy: {
        funkrufname: 'asc',
      },
    });
  }

  findTypen() {
    return this.prismaService.optaFunktion.findMany({
      select: {
        optaCode: true,
        label: true,
      },
    });
  }

  updateMany(fahrzeuge: Omit<FahrzeugDto, 'status'>[]) {
    this.logger.debug('updateMany', fahrzeuge);
    return this.prismaService.$transaction(async (transaction) => {
      for (const {
        id,
        optaFunktion,
        optaOrt,
        funkrufname,
        ...fahrzeug
      } of fahrzeuge) {
        const { maybeLabel, optaFunktion, optaOrdnung, optaOrt } =
          this.parseFunkrufnameParts({ funkrufname, ...fahrzeug });

        this.logger.debug('update one fahrzeugDto', fahrzeug);

        await transaction.fahrzeug.upsert({
          where: {
            id,
          },
          update: {
            ...fahrzeug,
            optaFunktionId: optaFunktion,
            optaOrtId: optaOrt,
            optaOrdnung: optaOrdnung,
            label: maybeLabel,
          },
          create: {
            ...fahrzeug,
            optaFunktionId: optaFunktion,
            optaOrtId: optaOrt,
            optaOrdnung: optaOrdnung,
            label: maybeLabel,
          },
        });
      }
    });
  }

  findFahrzeug(where: Prisma.FahrzeugWhereUniqueInput) {
    return this.prismaService.fahrzeug.findUnique({
      where,
      include: {
        optaOrt: true,
        optaFunktion: true,
      },
    });
  }

  async importFahrzeuge(fahrzeuge: FahrzeugImportDto[]) {
    return this.prismaService.$transaction(async (transaction) => {
      for (const fahrzeug of fahrzeuge) {
        const { maybeLabel, optaFunktion, optaOrdnung, optaOrt } =
          this.parseFunkrufnameParts(fahrzeug);

        this.logger.debug(
          `optaFunktion: ${optaFunktion}, optaOrt: ${optaOrt}, optaOrdnung: ${optaOrdnung}, maybeLabel: ${maybeLabel}`,
        );

        const existingFahrzeug = await transaction.fahrzeug.findFirst({
          where: {
            OR: [
              { label: fahrzeug.funkrufname },
              {
                optaFunktionId: optaFunktion,
                optaOrtId: optaOrt,
                optaOrdnung: optaOrdnung,
              },
            ],
            istTemporaer: false,
          },
        });

        await transaction.fahrzeug.upsert({
          where: {
            id: existingFahrzeug?.id ?? '',
          },
          create: {
            kapazitaet: fahrzeug.kapazitaet,
            istTemporaer: false,
            optaFunktionId: optaFunktion,
            optaOrtId: optaOrt,
            optaOrdnung: optaOrdnung,
            label: maybeLabel,
          },
          update: {
            kapazitaet: fahrzeug.kapazitaet,
            istTemporaer: false,
            label: maybeLabel,
          },
        });
      }
    });
  }

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
          throw new BadRequestException(
            'Funkrufnamen müssen dem Format entsprechen: d+-d+(-d+)( eigener Name) -- (d = Zahl, () = optional) oder eigener Name ohne Opta',
          );
        }
      }
      return null;
    };
  }
}
