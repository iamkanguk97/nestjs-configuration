import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { HealthModule } from '@api/health/health.module';
import { AllExceptionsFilter } from '@common/filters/all-exceptions.filter';
import { LoggerModule } from '@common/logger/logger.module';
import { PrismaModule } from '@database/prisma/prisma.module';
import { EnvironmentModule } from '@environment/environment.module';

@Module({
  imports: [EnvironmentModule, LoggerModule, PrismaModule, HealthModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
