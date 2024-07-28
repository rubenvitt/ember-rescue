import { Test, TestingModule } from '@nestjs/testing';
import { SecretsController } from './secrets.controller';
import { SecretsService } from './secrets.service';

describe('SecretsController', () => {
  let controller: SecretsController;
  let service: SecretsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecretsController],
      providers: [
        {
          provide: SecretsService,
          useValue: {
            read: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SecretsController>(SecretsController);
    service = module.get<SecretsService>(SecretsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('readSecret', () => {
    it('should return a secret', async () => {
      const key = 'testKey';
      const value = 'testValue';
      jest.spyOn(service, 'read').mockResolvedValue(value);

      const result = await controller.readSecret(key);
      expect(result).toEqual({ key, value });
      expect(service.read).toHaveBeenCalledWith(key);
    });
  });

  describe('createSecret', () => {
    it('should save a secret', async () => {
      const secretDto = { key: 'testKey', value: 'testValue' };
      jest.spyOn(service, 'save').mockResolvedValue(undefined);

      const result = await controller.createSecret(secretDto);
      expect(result).toBeUndefined();
      expect(service.save).toHaveBeenCalledWith(secretDto.key, secretDto.value);
    });
  });
});
