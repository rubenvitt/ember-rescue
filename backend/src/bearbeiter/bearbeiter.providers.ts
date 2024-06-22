import { Bearbeiter } from './bearbeiter.entity';
import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PROVIDERS } from '../constants';

export const bearbeiterProviders: Provider[] = [
  {
    provide: PROVIDERS.BEARBEITER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Bearbeiter),
    inject: [PROVIDERS.DATA_SOURCE],
  },
];