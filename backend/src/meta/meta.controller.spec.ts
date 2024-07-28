import { Test, TestingModule } from '@nestjs/testing';
import { MetaController } from './meta.controller';
import { MetaService } from './meta.service';

describe('MetaController', () => {
  let controller: MetaController;
  let service: MetaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetaController],
      providers: [
        {
          provide: MetaService,
          useValue: {
            findAppMetadata: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MetaController>(MetaController);
    service = module.get<MetaService>(MetaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMeta', () => {
    it('should return app metadata', () => {
      const mockMetadata = {
        version: '1.0.0',
        serverName: 'Test Server',
        serverId: '123456',
      };
      jest.spyOn(service, 'findAppMetadata').mockReturnValue(mockMetadata);

      const result = controller.getMeta();
      expect(result).toEqual(mockMetadata);
      expect(service.findAppMetadata).toHaveBeenCalled();
    });
  });
});
