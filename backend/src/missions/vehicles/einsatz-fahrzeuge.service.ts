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
  ) { }

  async addFahrzeugToEinsatz(
    fullOpta: string,
    einsatzId: string,
    bearbeiterId: string,
  ) {
    this.logger.log('Adding Fahrzeug to Einsatz', {
      fullOpta,
      einsatzId,
      bearbeiterId,
    });
    // Fahrzeug template finden
    const existingFahrzeug = await this.fahrzeugeService.findFahrzeug(fullOpta);
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
      fullOpta: existingFahrzeug.fullOpta ?? existingFahrzeug.opta.fullOpta,
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
    await this.changeStatus(fullOpta, einsatzId, bearbeiterId, {
      statusCode: 3,
    });
  }

  async findAktiveFahrzeugeImEinsatz(
    einsatzId: string,
  ): Promise<VehicleOnMissionDto[]> {
    const einsatz = await this.repository.findById(einsatzId);
    if (!einsatz?.fahrzeuge?.length) {
      return [];
    }

    const aktiveFahrzeuge = einsatz.fahrzeuge.filter(
      (fahrzeug) => !fahrzeug.einsatzende
    );

    const fahrzeugeWithOptaFunction = await Promise.all(
      aktiveFahrzeuge.map(async (fahrzeug) => {
        const functionOpta = await this.functionOptaRepository.findOne({
          code: fahrzeug.opta.functionCode,
        });

        return {
          fullOpta: fahrzeug.fullOpta,
          optaFunktion: functionOpta?.label || fahrzeug.opta.functionCode,
          einsatzbeginn: fahrzeug.einsatzbeginn.toISOString(),
          einsatzende: fahrzeug.einsatzende,
          personal: fahrzeug.personal.map(p => ({
            name: p.name,
            qualifikation: p.qualifikation?.abkuerzung || '',
            telefonnummer: p.telefonnummer || '',
            isFuehrungskraft: p.isFuehrungskraft || false
          })),
          kapazitaet: fahrzeug.kapazitaet,
          status_history: fahrzeug.status_history.map(entry => ({
            timestamp: entry.timestamp?.toISOString(),
            status: entry.status
          })),
        };
      })
    );

    return fahrzeugeWithOptaFunction;
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

    const uniqueFahrzeuge = [...new Map([...beendeteFahrzeuge, ...templates].map(item => [item.fullOpta, item])).values()];

    return await Promise.all(
      uniqueFahrzeuge
        .filter((fahrzeug) => !aktiveFahrzeugeOptas.has(fahrzeug.fullOpta))
        .map(async (fahrzeug) => {
          return {
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
    fullOpta: string,
    einsatzId: string,
    bearbeiterId: string,
    {
      statusId,
      statusCode,
    }:
      | { statusCode?: never; statusId: string }
      | { statusCode: number; statusId?: never },
  ) {
    this.logger.log(`Change status for ${fullOpta} to ${statusId}`);

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
        arrayFilters: [{ 'elem.fullOpta': fullOpta }],
      },
    );

    const mission = await this.repository.findById(einsatzId);
    if (!mission) {
      throw new NotFoundException('Einsatz not found');
    }

    const vehicle = mission.fahrzeuge.find(
      (f) => f.fullOpta.toString() == fullOpta,
    );
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found in Mission');
    }

    await this.einsatztagebuchService.createEinsatztagebuchEintrag(einsatzId, {
      einsatzId,
      bearbeiterId,
      type: 'RESSOURCEN',
      absender: mission!!.aufnehmendesRettungsmittel,
      empfaenger: vehicle.fullOpta,
      content: `${vehicle.fullOpta} wechselt in Status${status!!.code} (${status!!.description}).`,
    });
  }

  async removeFahrzeugFromEinsatz(
    fullOpta: string,
    einsatzId: string,
    bearbeiterId: string,
  ) {
    this.logger.debug('chaning status');

    const existingFahrzeug = await this.fahrzeugeService.findFahrzeug(fullOpta);

    const einsatz = await this.repository.findOneByIdAndUpdate(
      einsatzId,
      {
        $set: {
          'fahrzeuge.$[elem].einsatzende': new Date(),
        },
      },
      {
        arrayFilters: [{ 'elem.fullOpta': fullOpta }],
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
