import { NODE_ENV } from '@environment/environment.constant';
import { EnvironmentService } from '@environment/environment.service';
import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

describe('EnvironmentService', () => {
  let environmentService: EnvironmentService;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    mockConfigService = {
      getOrThrow: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnvironmentService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    environmentService = module.get<EnvironmentService>(EnvironmentService);
  });

  it('EnvironmentService가 정의되어 있어야 한다.', () => {
    expect(environmentService).toBeDefined();
  });

  describe('getString 메서드', () => {
    it('문자열 환경변수를 반환해야 한다.', () => {
      mockConfigService.getOrThrow.mockReturnValue('local');

      const result = environmentService.getString('ENV');

      expect(result).toBe('local');
      expect(mockConfigService.getOrThrow).toHaveBeenCalledWith('ENV');
    });
  });

  describe('getNumber 메서드', () => {
    it('문자열 환경변수를 숫자로 변환하여 반환해야 한다.', () => {
      mockConfigService.getOrThrow.mockReturnValue('9090');

      const result = environmentService.getNumber('PORT');

      expect(result).toBe(9090);
      expect(typeof result).toBe('number');
      expect(mockConfigService.getOrThrow).toHaveBeenCalledWith('PORT');
    });
  });

  describe('getBoolean 메서드', () => {
    it('true 값을 반환해야 한다.', () => {
      mockConfigService.getOrThrow.mockReturnValue(true);

      const result = environmentService.getBoolean('DB_SYNCHRONIZE');

      expect(result).toBe(true);
      expect(mockConfigService.getOrThrow).toHaveBeenCalledWith(
        'DB_SYNCHRONIZE',
      );
    });

    it('false 값을 반환해야 한다.', () => {
      mockConfigService.getOrThrow.mockReturnValue(false);

      const result = environmentService.getBoolean('DB_SYNCHRONIZE');

      expect(result).toBe(false);
    });
  });

  describe('isLocal', () => {
    it('ENV가 local인 경우 true를 반환해야 한다.', () => {
      mockConfigService.getOrThrow.mockReturnValue(NODE_ENV.LOCAL);
      expect(environmentService.isLocal()).toBe(true);
    });

    it('ENV가 local이 아닌 경우 false를 반환해야 한다.', () => {
      mockConfigService.getOrThrow.mockReturnValue(NODE_ENV.DEVELOPMENT);
      expect(environmentService.isLocal()).toBe(false);
    });
  });

  describe('isDevelopment', () => {
    it('ENV가 development인 경우 true를 반환해야 한다.', () => {
      mockConfigService.getOrThrow.mockReturnValue(NODE_ENV.DEVELOPMENT);
      expect(environmentService.isDevelopment()).toBe(true);
    });

    it('ENV가 development이 아닌 경우 false를 반환해야 한다.', () => {
      mockConfigService.getOrThrow.mockReturnValue(NODE_ENV.PRODUCTION);
      expect(environmentService.isDevelopment()).toBe(false);
    });
  });

  describe('isProduction', () => {
    it('ENV가 production인 경우 true를 반환해야 한다.', () => {
      mockConfigService.getOrThrow.mockReturnValue(NODE_ENV.PRODUCTION);
      expect(environmentService.isProduction()).toBe(true);
    });

    it('ENV가 production이 아닌 경우 false를 반환해야 한다.', () => {
      mockConfigService.getOrThrow.mockReturnValue(NODE_ENV.LOCAL);
      expect(environmentService.isProduction()).toBe(false);
    });
  });

  describe('getApplicationPort', () => {
    it('local 환경인 경우 9090 포트를 반환하도록 해야한다.', () => {
      mockConfigService.getOrThrow.mockReturnValue(NODE_ENV.LOCAL);
      expect(environmentService.getApplicationPort()).toBe(9090);
    });

    it('local 환경이 아닌 경우 환경변수에 명시된 PORT를 반환해야 한다.', () => {
      mockConfigService.getOrThrow
        .mockReturnValueOnce(NODE_ENV.PRODUCTION)
        .mockReturnValueOnce('9091');

      expect(environmentService.getApplicationPort()).toBe(9091);
    });
  });
});
