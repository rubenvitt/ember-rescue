import { DataSource } from 'typeorm';
import * as process from 'node:process';
import { Provider } from '@nestjs/common';
import { PROVIDERS } from '../constants';

export const databaseProviders: Provider[] = [
  {
    provide: PROVIDERS.DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV === 'development',
        applicationName: 'project-rescue-backend',
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        migrationsRun: true,
      });

      return dataSource.initialize();
    },
  },
];
