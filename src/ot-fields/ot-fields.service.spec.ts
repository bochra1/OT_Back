import { Test, TestingModule } from '@nestjs/testing';
import { OtFieldsService } from './ot-fields.service';

describe('OtFieldsService', () => {
  let service: OtFieldsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtFieldsService],
    }).compile();

    service = module.get<OtFieldsService>(OtFieldsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
