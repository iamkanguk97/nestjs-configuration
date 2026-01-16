import { HealthController } from '@api/health/health.controller';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
  });

  it('HealthController가 정상적으로 정의가 되어있어야 합니다.', () => {
    expect(healthController).toBeDefined();
  });

  describe('[END-POINT] healthCheck', () => {
    it('undefined를 반환해야 한다.', () => {
      expect(healthController.healthCheck()).toBeUndefined();
    });
  });
});
