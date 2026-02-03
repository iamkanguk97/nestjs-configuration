import { HttpStatus, ValidationPipe, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@app.module';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';

import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

describe('Health Check (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Same setup as bootstrap
    app.setGlobalPrefix('/api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
      prefix: 'v',
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      })
    );
    app.useGlobalInterceptors(new ResponseInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/health (GET)', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.isSuccess).toBe(true);
          expect(res.body.data).toBeNull();
          expect(res.body.timestamp).toBeDefined();
        });
    });

    it('should have valid response format', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toHaveProperty('isSuccess');
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('timestamp');
        });
    });
  });
});
