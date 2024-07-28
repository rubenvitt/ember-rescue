import { Test, TestingModule } from '@nestjs/testing';
import { BearbeiterController } from './bearbeiter.controller';
import { BearbeiterService } from './bearbeiter.service';
import { CreateBearbeiterDto } from '../types';

describe('BearbeiterController', () => {
  let controller: BearbeiterController;
  let bearbeiterService: BearbeiterService;

  beforeEach(async () => {
    const bearbeiterServiceMock = {
      findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'Test User' }]),
      findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Test User' }),
      findByNameOrCreate: jest
        .fn()
        .mockResolvedValue({ id: '1', name: 'Test User' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BearbeiterController],
      providers: [
        { provide: BearbeiterService, useValue: bearbeiterServiceMock },
      ],
    }).compile();

    controller = module.get<BearbeiterController>(BearbeiterController);
    bearbeiterService = module.get<BearbeiterService>(BearbeiterService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all bearbeiters', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([{ id: '1', name: 'Test User' }]);
    expect(bearbeiterService.findAll).toHaveBeenCalled();
  });

  it('should return a bearbeiter by id', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual({ id: '1', name: 'Test User' });
    expect(bearbeiterService.findOne).toHaveBeenCalledWith('1');
  });

  it('should find or create a bearbeiter by name', async () => {
    const dto: CreateBearbeiterDto = { name: 'Test User' };

    const result = await controller.login(dto);
    expect(result).toEqual({ id: '1', name: 'Test User' });
    expect(bearbeiterService.findByNameOrCreate).toHaveBeenCalledWith(
      'Test User',
    );
  });
});
