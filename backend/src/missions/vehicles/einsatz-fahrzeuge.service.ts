import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EinsatztagebuchService } from '../journal/einsatztagebuch.service';
import { StatusService } from '@templates/status/status.service';
import { FahrzeugeService } from '@templates/vehicles/fahrzeuge.service';
import { FahrzeugOnEinsatzDto } from '../schema/einsatz.schema';
import { EinsatzRepository } from '../schema/einsatz.repository';
import { FunctionOptaRepository } from '@templates/opta/repositories/function-opta.repository';
import { VehicleOnMissionDto } from './vehicle.dto';
import { FahrzeugTemplateDto } from '@templates/vehicles/fahrzeuge.dto';

@Injectable()
export class EinsatzFahrzeugeService {
  private readonly logger = new Logger(EinsatzFahrzeugeService.name);

  constructor(
    private readonly einsatztagebuchService: EinsatztagebuchService,
    private readonly fahrzeugeService: FahrzeugeService,
    private readonly statusService: StatusService,
    private readonly repository: EinsatzRepository,
    private readonly functionOptaRepository: FunctionOptaRepository,
  ) {}

  async addFahrzeugToEinsatz(
    fahrzeugId: string,
    einsatzId: string,
    bearbeiterId: string,
  ) {
    this.logger.log('Adding Fahrzeug to Einsatz', {
      fahrzeugId,
      einsatzId,
      bearbeiterId,
    });
    // Fahrzeug template finden
    const existingFahrzeug =
      await this.fahrzeugeService.findFahrzeug(fahrzeugId);
    if (!existingFahrzeug) {
      throw new NotFoundException('Fahrzeug not found');
    }

    const einsatz = await this.repository.findById(einsatzId);
    if (!einsatz) {
      throw new NotFoundException('Einsatz not found');
    }

    // Einsatztagebuch Eintrag erstellen
    await this.einsatztagebuchService.createEinsatztagebuchEintrag(einsatzId, {
      absender: existingFahrzeug.fullOpta,
      empfaenger: einsatz.aufnehmendesRettungsmittel,
      type: 'RESSOURCEN',
      einsatzId,
      bearbeiterId,
      content: `${existingFahrzeug.fullOpta} wurde dem Einsatz hinzugefügt.`,
    });

    // Korrekt formatiertes Fahrzeug-Objekt erstellen
    const fahrzeugData = {
      opta: {
        district: existingFahrzeug.opta.district,
        bosCode: existingFahrzeug.opta.bosCode,
        localCode: existingFahrzeug.opta.localCode,
        functionCode: existingFahrzeug.opta.functionCode,
        orderNumber: existingFahrzeug.opta.orderNumber,
        ort: existingFahrzeug.opta.ort,
        supplement: existingFahrzeug.opta.supplement,
        fullOpta: existingFahrzeug.fullOpta,
      },
      einsatzbeginn: new Date(),
      kapazitaet: existingFahrzeug.kapazitaet || 0,
      personal: [],
      status_history: [],
    };

    // Fahrzeug zum Einsatz hinzufügen
    await this.repository.findOneByIdAndUpdate(einsatzId, {
      $push: {
        fahrzeuge: fahrzeugData,
      },
    });

    // Status ändern
    await this.changeStatus(fahrzeugId, einsatzId, bearbeiterId, {
      statusCode: 3,
    });
  }

  async findAktiveFahrzeugeImEinsatz(
    einsatzId: string,
  ): Promise<VehicleOnMissionDto[]> {
    const einsatz = await this.repository.findById(einsatzId);
    // @ts-ignore FIXME
    return (
      einsatz?.fahrzeuge
        .filter((fahrzeug) => !fahrzeug.einsatzende)
        .map(async (fahrzeug) => ({
          ...fahrzeug,
          optaFunktion: (
            await this.functionOptaRepository.findOne({
              code: fahrzeug.opta.functionCode,
            })
          )?.label,
        })) || []
    );
  }

  async findVerfuegbareFahrzeuge(
    einsatzId: string,
  ): Promise<FahrzeugTemplateDto[]> {
    // Aktive Fahrzeuge im Einsatz holen
    const aktiveFahrzeuge = await this.findAktiveFahrzeugeImEinsatz(einsatzId);
    const aktiveFahrzeugeOptas = new Set(
      aktiveFahrzeuge.map((f) => f.fullOpta),
    );

    // Alle Templates und beendete Einsatzfahrzeuge holen
    const [templates, einsatz] = await Promise.all([
      this.fahrzeugeService.findAll(),
      this.repository.findById(einsatzId),
    ]);

    const beendeteFahrzeuge =
      einsatz?.fahrzeuge.filter((f) => f.einsatzende) || [];

    // Kombiniere Templates und beendete Fahrzeuge, filtere aktive Fahrzeuge aus
    return await Promise.all(
      [...templates, ...beendeteFahrzeuge]
        .filter((fahrzeug) => !aktiveFahrzeugeOptas.has(fahrzeug.fullOpta))
        .map(async (fahrzeug) => {
          return {
            id: fahrzeug.id,
            opta: fahrzeug.opta,
            iconDefinition: fahrzeug.iconDefinition,
            fullOpta: fahrzeug.fullOpta,
            // TODO[ember-rescue-68](rubeen, 31.12.24): maybe do this on client side?
            optaFunktion: (
              await this.functionOptaRepository.findOne({
                code: fahrzeug.opta.functionCode,
              })
            )?.label,
          } as FahrzeugTemplateDto;
        }),
    );
  }

  async findFahrzeugeImEinsatz(param: {
    einsatzId: string;
  }): Promise<FahrzeugOnEinsatzDto[]> {
    const fahrzeugeImEinsatz = await this.repository.findOne({
      _id: param.einsatzId,
      'fahrzeuge.ende': { $exists: false },
    });

    this.logger.debug(
      'fahrzeugeImEinsatz: ' + JSON.stringify(fahrzeugeImEinsatz, null, ''),
    );

    if (fahrzeugeImEinsatz) {
      return fahrzeugeImEinsatz.fahrzeuge as FahrzeugOnEinsatzDto[];
    }
    return [];
  }

  async changeStatus(
    fahrzeugId: string,
    einsatzId: string,
    bearbeiterId: string,
    {
      statusId,
      statusCode,
    }:
      | { statusCode?: never; statusId: string }
      | { statusCode: number; statusId?: never },
  ) {
    this.logger.log(`Change status for ${fahrzeugId} to ${statusId}`);
    const status = statusId
      ? await this.statusService.findStatusById(statusId)
      : await this.statusService.findStatusByCode(statusCode!!);

    const updateResult = await this.repository.findOneByIdAndUpdate(
      einsatzId,
      {
        $push: {
          'fahrzeuge.$[elem].status_history': {
            statusId: status!!.id,
            zeitpunkt: new Date(),
            bearbeiterId: bearbeiterId,
          },
        },
      },
      {
        arrayFilters: [{ 'elem._id': fahrzeugId }],
      },
    );
    await this.repository.findOne({
      _id: einsatzId,
      'fahrzeuge.$[elem]': 1,
    });
    this.logger.debug(
      'updateResult: ' + JSON.stringify(updateResult, null, ''),
    );

    const einsatz = await this.repository.findById(einsatzId);

    await this.einsatztagebuchService.createEinsatztagebuchEintrag(einsatzId, {
      einsatzId,
      bearbeiterId,
      type: 'RESSOURCEN',
      absender: einsatz!!.aufnehmendesRettungsmittel,
      empfaenger: fahrzeugId,
      content: `${'TODO'} wechselt in Status${status!!.code} (${status!!.description}).`,
    });

    await this.einsatztagebuchService.createEinsatztagebuchEintrag(einsatzId, {
      einsatzId,
      bearbeiterId,
      type: 'RESSOURCEN',
      absender: 'TODO', //fahrzeug.funkrufname,
      empfaenger: einsatz!!.aufnehmendesRettungsmittel,
      content: `${'TODO'} wechselt in Status${status!!.code} (${status!!.description}).`,
    });
  }

  async removeFahrzeugFromEinsatz(
    fahrzeugId: string,
    einsatzId: string,
    bearbeiterId: string,
  ) {
    this.logger.debug('chaning status');

    const existingFahrzeug =
      await this.fahrzeugeService.findFahrzeug(fahrzeugId);

    const einsatz = await this.repository.findOneByIdAndUpdate(
      einsatzId,
      {
        $set: {
          'fahrzeuge.$[elem].einsatzende': new Date(),
        },
      },
      {
        arrayFilters: [{ 'elem._id': fahrzeugId }],
      },
    );

    if (!einsatz) {
      throw Error('Einsatz not found');
    }

    this.einsatztagebuchService.createEinsatztagebuchEintrag(einsatzId, {
      absender: existingFahrzeug!!.fullOpta,
      empfaenger: einsatz?.aufnehmendesRettungsmittel,
      type: 'RESSOURCEN',
      einsatzId,
      bearbeiterId,
      content: `${existingFahrzeug!!.fullOpta} wurde aus dem Einsatz entfernt.`,
    });
  }
}
