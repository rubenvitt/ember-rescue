import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as alarmstichworte from './mongo/seeds/alarmstichworte.json';
import { Alarmstichwort } from './mongo/schemas/Alarmstichwort.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Alarmstichwort.name)
    private alarmstichwortModel: Model<Alarmstichwort>,
  ) {} //private optaFunktionModel: Model<OptaFunktion>, //@InjectModel(OptaFunktion.name) //private alarmstichwortModel: Model<Alarmstichwort>, //@InjectModel(Alarmstichwort.name)

  async onModuleInit() {
    this.logger.log('🌱 Start Seeding');

    // Prüfen, ob die Collection leer ist, und nur dann Daten einfügen
    // if ((await this.alarmstichwortModel.countDocuments()) === 0) {
    //   await this.alarmstichwortModel.insertMany(alarmstichwoerter);
    // }

    // Seed-Daten für OptaFunktionen
    const optaFunktionen = [
      { bezeichnung: 'Notarztwagen', beschreibung: 'Fahrzeug für Notärzte' },
      { bezeichnung: 'RTW', beschreibung: 'Rettungswagen' },
    ];

    if ((await this.alarmstichwortModel.countDocuments()) === 0) {
      this.logger.debug('💪 Need to insert Alarmstichworte');
      const alarmstichworteInserted =
        await this.alarmstichwortModel.insertMany(alarmstichworte);
      this.logger.log('✳️ Inserted Alarmstichworte', {
        count: alarmstichworteInserted.length,
      });
    } else {
      this.logger.log('💤 Kein Seeding für Alarmstichworte erforderlich');
    }

    this.logger.warn('🚧 TODO: should seed', {
      optaFunktionen,
    });
    this.logger.log('🌱 Seed-Daten erfolgreich geprüft und ggf. eingefügt');
  }
}
