import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EinsatztagebuchEintrag } from './einsatztagebuch.entity';
import { PROVIDERS } from '../constants';

@Injectable()
export class EinsatztagebuchService {
  constructor(
    @Inject(PROVIDERS.EINSATZTAGEBUCH_REPOSITORY)
    private readonly repository: Repository<EinsatztagebuchEintrag>,
  ) {}

  getEinsatztagebuch() {
    return this.repository.find({});
  }

  createEinsatztagebuchEintrag() {
    const eintrag = this.repository.create({
      type: 'GENERISCH',
      content: 'test',
      absender: 'test',
      empfaenger: 'test',
      zeitpunkt: new Date(),
    });
    return this.repository.save(eintrag);
  }
}
