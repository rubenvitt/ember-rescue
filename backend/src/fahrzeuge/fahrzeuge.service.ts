import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  FahrzeugDto,
  FahrzeugImportDto,
  UpdateCreateFahrzeugeDto,
} from '../types';
import { Prisma } from '@prisma/client';
import { InjectModel } from '@nestjs/mongoose';
import { Fahrzeug } from 'src/database/mongo/schemas/fahrzeug.schema';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FahrzeugeService {
  private readonly logger = new Logger(FahrzeugeService.name);

  constructor(
    @InjectModel(Fahrzeug.name) private readonly fahrzeugModel: Model<Fahrzeug>,
  ) {}

  async findAll(filter?: Prisma.FahrzeugWhereInput) {
    // TODO[ember-rescue-68](rubeen, 14.11.24): fahrzeuge im Einsatz
    return this.fahrzeugModel.find();
  }

  updateMany(fahrzeuge: UpdateCreateFahrzeugeDto) {
    this.logger.debug('updateMany', fahrzeuge);

    return Promise.all(
      fahrzeuge.map(async ({ _id, opta, ...fahrzeug }) => {
        return this.fahrzeugModel.findByIdAndUpdate(
          _id,
          {
            fullOpta: `${opta.district} ${opta.bosCode} ${opta.ort} ${opta.localCode}-${opta.functionCode}-${opta.orderNumber}`,
            ...fahrzeug,
          },
          {
            upsert: true,
            new: true,
          },
        );
      }),
    );
  }

  findFahrzeug({ _id }: { _id: string }) {
    return this.fahrzeugModel.findById(_id).exec();
  }

  async importFahrzeuge(fahrzeuge: UpdateCreateFahrzeugeDto) {
    return Promise.all(
      fahrzeuge.map(async ({ _id, opta, ...fahrzeug }) => {
        return this.fahrzeugModel.findByIdAndUpdate(
          _id ?? new mongoose.Types.ObjectId(),
          {
            fullOpta: `${opta.district} ${opta.bosCode} ${opta.ort} ${opta.localCode}-${opta.functionCode}-${opta.orderNumber}`,
            ...fahrzeug,
          },
          {
            upsert: true,
            new: true,
          },
        );
      }),
    );

    // return this.prismaService.$transaction(async (transaction) => {
    //   for (const fahrzeug of fahrzeuge) {
    //     const { maybeLabel, optaFunktion, optaOrdnung, optaOrt } =
    //       this.parseFunkrufnameParts(fahrzeug);
    //
    //     this.logger.debug(
    //       `optaFunktion: ${optaFunktion}, optaOrt: ${optaOrt}, optaOrdnung: ${optaOrdnung}, maybeLabel: ${maybeLabel}`,
    //     );
    //
    //     const existingFahrzeug = await transaction.fahrzeug.findFirst({
    //       where: {
    //         OR: [
    //           { label: fahrzeug.funkrufname },
    //           {
    //             optaFunktionId: optaFunktion,
    //             optaOrtId: optaOrt,
    //             optaOrdnung: optaOrdnung,
    //           },
    //         ],
    //         istTemporaer: false,
    //       },
    //     });
    //
    //     await transaction.fahrzeug.upsert({
    //       where: {
    //         id: existingFahrzeug?.id ?? '',
    //       },
    //       create: {
    //         kapazitaet: fahrzeug.kapazitaet,
    //         istTemporaer: false,
    //         optaFunktionId: optaFunktion,
    //         optaOrtId: optaOrt,
    //         optaOrdnung: optaOrdnung,
    //         label: maybeLabel,
    //       },
    //       update: {
    //         kapazitaet: fahrzeug.kapazitaet,
    //         istTemporaer: false,
    //         label: maybeLabel,
    //       },
    //     });
    //   }
    // });
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
