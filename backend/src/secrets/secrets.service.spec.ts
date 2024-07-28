import { Test, TestingModule } from '@nestjs/testing';
import { SecretsService } from './secrets.service';
import { PrismaService } from '../database/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

describe('SecretsService', () => {
  let service: SecretsService;
  let prismaService: PrismaService;
  let configService: ConfigService;

  const IV = Buffer.from('1234567890123456').toString('hex');

  beforeEach(async () => {
    jest
      .spyOn(crypto, 'randomBytes')
      .mockImplementation(() => Buffer.from('1234567890123456')); // Mocking IV for consistency

    const mockCipher = {
      update: jest.fn().mockReturnValue('encryptedPart'),
      final: jest.fn().mockReturnValue('finalEncryptedPart'),
      setAutoPadding: jest.fn(),
      _transform: jest.fn(),
      _flush: jest.fn(),
      _writableState: {},
    };

    jest
      .spyOn(crypto, 'createCipheriv')
      .mockImplementation(() => mockCipher as unknown as crypto.Cipher);

    const mockDecipher = {
      update: jest.fn().mockReturnValue('decryptedPart'),
      final: jest.fn().mockReturnValue('finalDecryptedPart'),
      setAutoPadding: jest.fn(),
      _transform: jest.fn(),
      _flush: jest.fn(),
      _writableState: {},
    };

    jest
      .spyOn(crypto, 'createDecipheriv')
      .mockImplementation(() => mockDecipher as unknown as crypto.Decipher);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecretsService,
        {
          provide: PrismaService,
          useValue: {
            secret: {
              upsert: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('12345678901234567890123456789012'), // A 32-byte key
          },
        },
      ],
    }).compile();

    service = module.get<SecretsService>(SecretsService);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('save', () => {
    it('should save an encrypted secret', async () => {
      const key = 'testKey';
      const value = 'testValue';
      const encryptedValue = `${IV}:encryptedPartfinalEncryptedPart`; // Expected encrypted value

      jest.spyOn(prismaService.secret, 'upsert').mockResolvedValue(undefined);

      await service.save(key, value);

      expect(prismaService.secret.upsert).toHaveBeenCalledWith({
        where: { key },
        update: { value: encryptedValue },
        create: { key, value: encryptedValue },
      });
    });
  });

  describe('read', () => {
    it('should return a decrypted secret', async () => {
      const key = 'testKey';
      const encryptedValue = `${IV}:encryptedPartfinalEncryptedPart`; // Expected encrypted value
      const mockSecret = {
        id: 'testId',
        key,
        value: encryptedValue,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.secret, 'findUnique')
        .mockResolvedValue(mockSecret);

      const result = await service.read(key);

      // Mock decryption result
      const decryptedValue = 'decryptedPartfinalDecryptedPart';

      expect(result).toBe(decryptedValue);
      expect(prismaService.secret.findUnique).toHaveBeenCalledWith({
        where: { key },
      });
    });

    it('should return null if secret does not exist', async () => {
      const key = 'nonexistentKey';

      jest.spyOn(prismaService.secret, 'findUnique').mockResolvedValue(null);

      const result = await service.read(key);

      expect(result).toBeNull();
      expect(prismaService.secret.findUnique).toHaveBeenCalledWith({
        where: { key },
      });
    });
  });
});
