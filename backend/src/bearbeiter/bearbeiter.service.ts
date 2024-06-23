import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Bearbeiter } from './bearbeiter.entity';
import { PROVIDERS } from '../constants';

@Injectable()
export class BearbeiterService {
  private logger = new Logger(BearbeiterService.name);

  constructor(
    @Inject(PROVIDERS.BEARBEITER_REPOSITORY)
    private readonly bearbeiterRepository: Repository<Bearbeiter>,
  ) {}

  async findAll(): Promise<Bearbeiter[]> {
    return this.bearbeiterRepository.find({
      where: { active: true },
      select: { name: true, id: true, active: false },
    });
  }

  async findByNameOrCreate(name: string) {
    console.log('Environment: ', process.env.NODE_ENV);
    const bearbeiter = await this.bearbeiterRepository.findOneBy({ name });
    this.logger.debug(JSON.stringify(bearbeiter));
    if (bearbeiter) {
      return bearbeiter;
    } else {
      console.log('Creating bearbeiter: ', name);
      const newBearbeiter = this.bearbeiterRepository.create({ name: name });
      return await this.bearbeiterRepository.save(newBearbeiter);
    }
  }
}
