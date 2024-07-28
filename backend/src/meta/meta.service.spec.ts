import { Test, TestingModule } from '@nestjs/testing';
import { MetaService } from './meta.service';
import { ConfigService } from '@nestjs/config';

describe('MetaService', () => {
  let service: MetaService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetaService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
            getOrThrow: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MetaService>(MetaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAppMetadata', () => {
    it('should return app metadata', () => {
      const mockVersion = '1.0.0';
      const mockServerName = 'Test Server';

      configService.get = jest.fn().mockImplementation((key: string) => {
        if (key === 'VERSION') return mockVersion;
      });
      configService.getOrThrow = jest.fn().mockReturnValue(mockServerName);

      const metadata = service.findAppMetadata();
      expect(metadata).toEqual({
        version: mockVersion,
        serverName: mockServerName,
        serverId: expect.any(String),
      });
    });

    it('should return default version if VERSION is not set', () => {
      const mockServerName = 'Test Server';

      configService.get = jest.fn().mockImplementation((key: string) => null);
      configService.getOrThrow = jest.fn().mockReturnValue(mockServerName);

      const metadata = service.findAppMetadata();
      expect(metadata).toEqual({
        version: '0.0.0-development',
        serverName: mockServerName,
        serverId: expect.any(String),
      });
    });

    it('should throw an error if SERVER_NAME is not set', () => {
      configService.get = jest.fn();
      configService.getOrThrow = jest.fn().mockImplementation(() => {
        throw new Error('SERVER_NAME not set');
      });

      expect(() => service.findAppMetadata()).toThrow('SERVER_NAME not set');
    });
  });
});
