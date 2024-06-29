import { Provider } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

export const databaseProviders: Provider[] = [PrismaService];
