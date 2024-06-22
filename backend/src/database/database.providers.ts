import { DataSource } from 'typeorm';
import * as process from 'node:process';
import { Provider } from '@nestjs/common';
import { PROVIDERS } from '../constants';

export const databaseProviders: Provider[] = [
  {
    provide: PROVIDERS.DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'sqlite',
        database: 'database.sqlite',
        entities: [
          __dirname + '/../**/*.entity{.ts,.js}',
        ],
        synchronize: process.env.NODE_ENV === 'development',
      });

      return dataSource.initialize();
    },
  },
];