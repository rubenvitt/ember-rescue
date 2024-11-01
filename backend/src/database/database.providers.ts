import { Provider } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as mongoose from 'mongoose';

export const databaseProviders: Provider[] = [
  PrismaService,
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> => {
      return mongoose.connect(process.env.MONGODB_URL!!);
    },
  },
];
