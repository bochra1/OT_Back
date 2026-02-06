import { Test, TestingModule } from '@nestjs/testing';
import { OtFieldsController } from './ot-fields.controller';

describe('OtFieldsController', () => {
  let controller: OtFieldsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtFieldsController],
    }).compile();

    controller = module.get<OtFieldsController>(OtFieldsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
