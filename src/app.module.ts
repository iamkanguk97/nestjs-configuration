import { HealthModule } from '@api/health/health.module';
import { PrismaModule } from '@database/prisma/prisma.module';
import { EnvironmentModule } from '@environment/environment.module';
import { LoggerModule } from '@logger/logger.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [EnvironmentModule, LoggerModule, PrismaModule, HealthModule],
})
export class AppModule {}
