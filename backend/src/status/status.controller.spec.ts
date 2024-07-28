import { Test, TestingModule } from '@nestjs/testing';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';

describe('StatusController', () => {
  let controller: StatusController;
  let statusService: StatusService;

  beforeEach(async () => {
    const mockStatusService = {
      findAll: jest.fn().mockResolvedValue([{ id: 1, status: 'ok' }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusController],
      providers: [
        {
          provide: StatusService,
          useValue: mockStatusService,
        },
      ],
    }).compile();

    controller = module.get<StatusController>(StatusController);
    statusService = module.get<StatusService>(StatusService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('status', () => {
    it('should return status', async () => {
      const result = await controller.status();
      expect(result).toEqual([{ id: 1, status: 'ok' }]);
      expect(statusService.findAll).toHaveBeenCalled();
    });
  });
});
