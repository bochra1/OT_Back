import { Test, TestingModule } from '@nestjs/testing';
import { OTRequestService } from './ot-requests.service';

describe('OtRequestsService', () => {
  let service: OTRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OTRequestService],
    }).compile();

    service = module.get<OTRequestService>(OTRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
