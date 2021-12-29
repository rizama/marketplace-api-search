import { Test, TestingModule } from '@nestjs/testing';
import { JaknotService } from './jaknot.service';

describe('JaknotService', () => {
  let service: JaknotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JaknotService],
    }).compile();

    service = module.get<JaknotService>(JaknotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
