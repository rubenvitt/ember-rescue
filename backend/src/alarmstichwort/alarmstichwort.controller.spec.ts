import { Test, TestingModule } from '@nestjs/testing';
import { AlarmstichwortController } from './alarmstichwortController';
import { AlarmstichwortService } from './alarmstichwort.service';

describe('AlarmstichwortController', () => {
  let controller: AlarmstichwortController;
  let service: AlarmstichwortService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlarmstichwortController],
      providers: [
        {
          provide: AlarmstichwortService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(['ALARM1', 'ALARM2']),
          },
        },
      ],
    }).compile();

    controller = module.get<AlarmstichwortController>(AlarmstichwortController);
    service = module.get<AlarmstichwortService>(AlarmstichwortService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAlarmstichworte', () => {
    it('should return a list of alarm keywords', async () => {
      const result = await controller.getAlarmstichworte();
      expect(result).toEqual(['ALARM1', 'ALARM2']);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
