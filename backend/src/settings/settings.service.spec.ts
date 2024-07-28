import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from './settings.service';
import { SecretsService } from '../secrets/secrets.service';
import { SettingsDto } from './settings.dto';

describe('SettingsService', () => {
  let service: SettingsService;
  let secretsService: SecretsService;

  beforeEach(async () => {
    const mockSecretsService = {
      save: jest.fn().mockResolvedValue(undefined),
      read: jest.fn().mockResolvedValue('test-api-key'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: SecretsService,
          useValue: mockSecretsService,
        },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    secretsService = module.get<SecretsService>(SecretsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveSettings', () => {
    it('should save settings', async () => {
      const settingsDto: SettingsDto = { mapboxApi: 'new-api-key' };

      await service.saveSettings(settingsDto);

      expect(secretsService.save).toHaveBeenCalledWith(
        'mapboxApi',
        'new-api-key',
      );
    });
  });

  describe('findSettings', () => {
    it('should return settings', async () => {
      const result = await service.findSettings();
      expect(result).toEqual({ mapboxApi: 'test-api-key' });
      expect(secretsService.read).toHaveBeenCalledWith('mapboxApi');
    });
  });
});
