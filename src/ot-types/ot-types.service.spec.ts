import { Test, TestingModule } from '@nestjs/testing';
import { OtTypesService } from './ot-types.service';

describe('OtTypesService', () => {
  let service: OtTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtTypesService],
    }).compile();

    service = module.get<OtTypesService>(OtTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
