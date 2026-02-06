import { Test, TestingModule } from '@nestjs/testing';
import { OtTypesController } from './ot-types.controller';

describe('OtTypesController', () => {
  let controller: OtTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtTypesController],
    }).compile();

    controller = module.get<OtTypesController>(OtTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
