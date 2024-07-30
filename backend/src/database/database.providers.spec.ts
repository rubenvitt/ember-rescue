import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma/prisma.service';
import { databaseProviders } from './database.providers';

describe('databaseProviders', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...databaseProviders],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should provide PrismaService', () => {
    expect(prismaService).toBeDefined();
  });
});
