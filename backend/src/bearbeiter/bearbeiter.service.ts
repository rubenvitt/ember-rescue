import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Bearbeiter } from './bearbeiter.entity';
import { PROVIDERS } from '../constants';

@Injectable()
export class BearbeiterService {
  constructor(@Inject(PROVIDERS.BEARBEITER_REPOSITORY) private readonly bearbeiterRepository: Repository<Bearbeiter>) {
  }

  async findAll(): Promise<Bearbeiter[]> {
    console.log('Environment: ', process.env.NODE_ENV);
    return this.bearbeiterRepository.find();
  }
}
