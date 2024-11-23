import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EinsatztagebuchService } from '../journal/einsatztagebuch.service';
import { StatusService } from '@templates/status/status.service';
import { FahrzeugeService } from '@templates/vehicles/fahrzeuge.service';
import { FahrzeugOnEinsatzDto } from '../schema/einsatz.schema';
import { EinsatzRepository } from '../schema/einsatz.repository';

@Injectable()
export class EinsatzFahrzeugeService {
  private readonly logger = new Logger(EinsatzFahrzeugeService.name);

  constructor(
    private readonly einsatztagebuchService: EinsatztagebuchService,
    private readonly fahrzeugeService: FahrzeugeService,
    private readonly statusService: StatusService,
    private readonly repository: EinsatzRepository,
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
    const existingFahrzeug =
      await this.fahrzeugeService.findFahrzeug(fahrzeugId);

    const einsatz = await this.repository.findById(einsatzId);
    if (!einsatz)
      throw new NotFoundException('Einsatz not found', {
        description: `Einsatz mit der ID ${einsatzId} nicht gefunden.`,
      });

    await this.einsatztagebuchService.createEinsatztagebuchEintrag(einsatzId, {
      absender: existingFahrzeug!!.fullOpta,
      empfaenger: einsatz.aufnehmendesRettungsmittel,
      type: 'RESSOURCEN',
      einsatzId,
      bearbeiterId,
      content: `${existingFahrzeug?.fullOpta} wurde dem Einsatz hinzugefügt.`,
    });

    await this.repository.findOneByIdAndUpdate(einsatzId, {
      $push: {
        fahrzeuge: {
          opta: existingFahrzeug!!.fullOpta,
          einsatzbeginn: new Date(),
          kapazitaet: existingFahrzeug!!.kapazitaet,
        },
      },
    });

    await this.changeStatus(fahrzeugId, einsatzId, bearbeiterId, {
      statusCode: 3,
    });
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
