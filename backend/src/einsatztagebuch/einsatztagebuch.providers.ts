import { Provider } from '@nestjs/common';
import { PROVIDERS } from '../constants';
import { DataSource } from 'typeorm';
import { EinsatztagebuchEintrag } from './einsatztagebuch.entity';

export const einsatztagebuchProviders: Provider[] = [
  {
    provide: PROVIDERS.EINSATZTAGEBUCH_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(EinsatztagebuchEintrag),
    inject: [PROVIDERS.DATA_SOURCE],
  },
];
