import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as alarmstichworte from './mongo/seeds/alarmstichworte.json';
import * as statusItems from './mongo/seeds/status.json';
import * as qualifikationItems from './mongo/seeds/qualifikationen.json';
import { Qualifikation } from './mongo/schemas/qualifikation.schema';
import * as optaFunktionen from './mongo/seeds/opta/funktionen.json';
import * as optaBos from './mongo/seeds/opta/bos.json';
import * as optaDistricts from './mongo/seeds/opta/districts.json';
import * as optaLocalCodes from './mongo/seeds/opta/local-codes.json';
import { Alarmstichwort } from './mongo/schemas/alarmstichwort.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BaseOptaEntry,
  BosOptaEntry,
  DistrictOptaEntry,
  FunctionOptaEntry,
  LocalCodeOptaEntry,
} from './mongo/schemas/opta/entry.schema';
import { Opta } from './mongo/schemas/opta.schema';
import { Status } from './mongo/schemas/status.schema';
import { Secret } from './mongo/schemas/secret.schema';
import { Einsatz } from './mongo/schemas/einsatz.schema';
import { Bearbeiter } from './mongo/schemas/bearbeiter.schema';
import { Counter } from './mongo/schemas/counter.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Alarmstichwort.name)
    private alarmstichwortModel: Model<Alarmstichwort>,
    @InjectModel(BaseOptaEntry.mongoName)
    private readonly functionEntry: Model<FunctionOptaEntry>,
    @InjectModel(BaseOptaEntry.mongoName)
    private readonly bosEntry: Model<BosOptaEntry>,
    @InjectModel(BaseOptaEntry.mongoName)
    private readonly districtEntry: Model<DistrictOptaEntry>,
    @InjectModel(BaseOptaEntry.mongoName)
    private readonly localCodesEntry: Model<LocalCodeOptaEntry>,
    @InjectModel(Status.name)
    private readonly status: Model<Status>,
    @InjectModel(Opta.name)
    private readonly optaModel: Model<Opta>,
    @InjectModel(Secret.name)
    private readonly secretModel: Model<Secret>,
    @InjectModel(Einsatz.name)
    private readonly einsatzModel: Model<Einsatz>,
    @InjectModel(Bearbeiter.name)
    private readonly bearbeiterModel: Model<Bearbeiter>,
    @InjectModel(Counter.name)
    private readonly counterModel: Model<Counter>,
    @InjectModel(Qualifikation.name)
    private readonly qualifikationModel: Model<Qualifikation>,
  ) {}

  async onModuleInit() {
    this.logger.log('🌱 Start Seeding');

    // Alarmstichworte
    await this.insertSeedData(
      alarmstichworte,
      this.alarmstichwortModel,
      'Alarmstichworte',
    );

    // Seed-Daten für Opta
    await this.insertSeedData(
      optaFunktionen,
      this.functionEntry,
      'OptaFunktionen',
    );

    await this.insertSeedData(optaBos, this.bosEntry, 'OptaBos');

    await this.insertSeedData(
      optaDistricts,
      this.districtEntry,
      'OptaDistricts',
    );

    await this.insertSeedData(
      optaLocalCodes,
      this.localCodesEntry,
      'OptaLocalCodes',
    );

    await this.insertSeedData(statusItems, this.status, 'Status');

    await this.insertSeedData(
      qualifikationItems,
      this.qualifikationModel,
      'Qualifikationen',
    );

    try {
      await this.optaModel.create({
        district: await this.districtEntry.findOne({ code: 'NI' }),
        bosCode: await this.bosEntry.findOne({ code: 'DRK' }),
        localCode: await this.localCodesEntry.findOne({ code: '40' }),
        functionCode: await this.functionEntry.findOne({ code: '12' }),
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

    if (
      (await this.einsatzModel
        .countDocuments({ abgeschlossen: null })
        .exec()) === 0
    ) {
      try {
        let newVar = await this.einsatzModel.create({
          bearbeiter: await this.bearbeiterModel.findOne({ name: 'Hans' }),
          aufnehmendesRettungsmittel: (await this.optaModel.findOne().exec())!!
            .fullOpta,
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

  private async insertSeedData<T>(
    data: unknown[],
    model: Model<T>,
    dataType: string,
  ) {
    try {
      this.logger.debug(`🤖 Try to insert ${dataType}`);
      const insertedData = await model.insertMany(data, { ordered: false });
      this.logger.log(`✳️ Inserted ${insertedData.length} ${dataType}`);
    } catch (e) {
      this.logger.log(`✳️ Inserted ${e.insertedDocs.length} ${dataType}`);
      this.logger.debug(
        `🦘 Skipped ${e.writeErrors.length} ${dataType} (${e.writeErrors[0].err.errmsg})`,
      );
    }
  }
}
