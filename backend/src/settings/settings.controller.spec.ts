import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { SettingsDto } from './settings.dto';

describe('SettingsController', () => {
  let controller: SettingsController;
  let settingsService: SettingsService;

  beforeEach(async () => {
    const mockSettingsService = {
      findSettings: jest
        .fn()
        .mockResolvedValue([{ id: 1, mapboxApi: 'test-api-key' }]),
      saveSettings: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        {
          provide: SettingsService,
          useValue: mockSettingsService,
        },
      ],
    }).compile();

    controller = module.get<SettingsController>(SettingsController);
    settingsService = module.get<SettingsService>(SettingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findSettings', () => {
    it('should return settings', async () => {
      const result = await controller.findSettings();
      expect(result).toEqual([{ id: 1, mapboxApi: 'test-api-key' }]);
      expect(settingsService.findSettings).toHaveBeenCalled();
    });
  });

  describe('saveSettings', () => {
    it('should save settings', async () => {
      const settingsDto: SettingsDto = { mapboxApi: 'new-api-key' };

      await controller.saveSettings(settingsDto);

      expect(settingsService.saveSettings).toHaveBeenCalledWith(settingsDto);
    });
  });
});
