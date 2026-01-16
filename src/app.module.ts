import { HealthModule } from '@api/health/health.module';
import { AllExceptionsFilter } from '@common/filters/all-exceptions.filter';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { LoggerModule } from '@common/logger/logger.module';
import { PrismaModule } from '@database/prisma/prisma.module';
import { EnvironmentModule } from '@environment/environment.module';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [EnvironmentModule, LoggerModule, PrismaModule, HealthModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
