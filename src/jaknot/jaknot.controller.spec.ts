import { Test, TestingModule } from '@nestjs/testing';
import { JaknotController } from './jaknot.controller';

describe('JaknotController', () => {
  let controller: JaknotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JaknotController],
    }).compile();

    controller = module.get<JaknotController>(JaknotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
