import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as alarmstichworte from '@core/database/seeds/alarmstichworte.json';
import * as statusItems from '@core/database/seeds/status.json';
import * as qualifikationItems from '@core/database/seeds/qualifikationen.json';
import * as optaFunktionen from './seeds/opta/funktionen.json';
import * as optaBos from './seeds/opta/bos.json';
import * as optaDistricts from './seeds/opta/districts.json';
import * as optaLocalCodes from './seeds/opta/local-codes.json';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Status } from '@templates/status/status.schema';
import { Bearbeiter } from '../../user/bearbeiter/core/bearbeiter.schema';
import { Counter } from './mongo/schemas/counter.schema';
import { BosOptaRepository } from '@templates/opta/repositories/bos-opta.repository';
import { BosGroup } from '@templates/opta/constants';
import { OptaRepository } from '@templates/opta/repositories/opta.repository';
import { FunctionOptaRepository } from '@templates/opta/repositories/function-opta.repository';
import { LocalCodeOptaRepository } from '@templates/opta/repositories/local-code-opta.repository';
import { DistrictOptaRepository } from '@templates/opta/repositories/district-opta.repository';
import { FunctionOptaTemplate } from '@templates/opta/schemas/function-opta.schema';
import { TemplateRepository } from '@templates/template.repository';
import { BosOptaTemplate } from '@templates/opta/schemas/bos-opta.schema';
import { DistrictOptaTemplate } from '@templates/opta/schemas/district-opta.schema';
import { LocalCodeOptaTemplate } from '@templates/opta/schemas/local-code-opta.schema';
import { AlarmstichwortRepository } from '@templates/alarmstichworte/alarmstichwort.repository';
import { TemplateDocument } from '@core/database/base-documents';
import { QualifikationenRepository } from '@templates/qualifications/qualifikationen.repository';
import { StatusRepository } from '@templates/status/status.repository';
import { EinsatzRepository } from '../../missions/schema/einsatz.repository';
import { FahrzeugeRepository } from '@templates/vehicles/fahrzeuge.repository';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Bearbeiter.name)
    private readonly bearbeiterModel: Model<Bearbeiter>,
    @InjectModel(Counter.name)
    private readonly counterModel: Model<Counter>,
    private readonly optaRepository: OptaRepository,
    private readonly bosOptaRepository: BosOptaRepository,
    private readonly districtOptaRepository: DistrictOptaRepository,
    private readonly functionOptaRepository: FunctionOptaRepository,
    private readonly localCodeOptaRepository: LocalCodeOptaRepository,
    private readonly alarmstichwortRepository: AlarmstichwortRepository,
    private readonly qualifikationenRepository: QualifikationenRepository,
    private readonly statusRepository: StatusRepository,
    private readonly einsatzRepository: EinsatzRepository,
    private readonly fahrzeugTemplateRepository: FahrzeugeRepository,
  ) {}

  async onModuleInit() {
    this.logger.log('🌱 Start Seeding');

    try {
      await this.bosOptaRepository.create({
        code: 'DRK',
        description: 'Dresden',
        label: 'Dresden',
        group: BosGroup.Feuerwehren,
        rufname: "Flotte 'Dresden'",
      });
    } catch (e) {
      this.logger.error('Error while seeding bos opta: ' + e.message);
    }

    // Alarmstichworte
    await this.insertSeedServiceData(
      alarmstichworte,
      this.alarmstichwortRepository,
      'Alarmstichworte',
    );

    await this.insertSeedServiceData(
      optaFunktionen as FunctionOptaTemplate[],
      this.functionOptaRepository,
      'OptaFunktionen',
    );

    await this.insertSeedServiceData(
      optaBos as BosOptaTemplate[],
      this.bosOptaRepository,
      'OptaBos',
    );

    await this.insertSeedServiceData(
      optaDistricts as DistrictOptaTemplate[],
      this.districtOptaRepository,
      'OptaDistricts',
    );

    await this.insertSeedServiceData(
      optaLocalCodes as LocalCodeOptaTemplate[],
      this.localCodeOptaRepository,
      'OptaLocalCodes',
    );

    await this.insertSeedServiceData(
      statusItems,
      this.statusRepository,
      'Status',
    );

    await this.insertSeedServiceData(
      qualifikationItems,
      this.qualifikationenRepository,
      'Qualifikationen',
    );

    try {
      await this.optaRepository.create({
        district: 'NI',
        bosCode: 'DRK',
        localCode: '40',
        functionCode: '12',
        orderNumber: '01',
        ort: 'Uelzen',
      });
    } catch (e) {
      this.logger.error('Error while seeding opta: ' + e.message);
    }

    try {
      await this.bearbeiterModel.create({
        name: 'Hans',
      });
    } catch (e) {
      this.logger.error('Error while seeding bearbeiter: ' + e.message);
    }

    if ((await this.fahrzeugTemplateRepository.count({})) === 0) {
      this.logger.debug('🤖 Attempting to create a new Fahrzeug');
      const opta = (
        await this.optaRepository.findActive({}, {}, { limit: 1 })
      )[0];
      await this.fahrzeugTemplateRepository.create({
        opta: opta,
        fullOpta: opta.fullOpta,
        kapazitaet: 2,
      });
      this.logger.log('✳️ Created new Fahrzeug');
    } else {
      this.logger.debug('🦘 Skipped: Fahrzeug already exists');
    }

    if (!(await this.einsatzRepository.anyActive())) {
      try {
        let newVar = await this.einsatzRepository.create({
          bearbeiter: await this.bearbeiterModel.findOne({ name: 'Hans' }),
          aufnehmendesRettungsmittel: 'Testfahrzeug',
          einsatzMeta: {},
          einsatzAlarmstichwort: {
            code: 'B2',
            description: 'Brand',
          },
          einsatznummer: (
            await this.counterModel.findOneAndUpdate(
              { name: 'einsatznummer' },
              { $inc: { seq: 1 } },
              { new: true, upsert: true },
            )
          ).seq,
          beginn: new Date(),
        });
      } catch (e) {
        this.logger.error('Error while seeding einsatz: ' + e.message);
      }
    }
    this.logger.log('🌱 Finished Seeding');
  }

  private async insertSeedServiceData<T extends TemplateDocument>(
    data: Partial<T>[],
    repository: TemplateRepository<T>,
    dataType: string,
  ) {
    try {
      this.logger.debug(`🤖 Try to insert ${dataType}`);
      await repository.createMany(data, { ordered: false });
      this.logger.log(`✳️ Inserted ${data.length} ${dataType}`);
    } catch (e) {
      this.logger.log(`✳️ Inserted ${e.insertedDocs.length} ${dataType}`);
      this.logger.debug(
        `🦘 Skipped ${e.writeErrors.length} ${dataType} (${e.writeErrors[0].err.errmsg})`,
      );
    }
  }
}
