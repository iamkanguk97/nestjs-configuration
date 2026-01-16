import { HealthModule } from '@api/health/health.module';
import { LoggerModule } from '@common/logger/logger.module';
import { PrismaModule } from '@database/prisma/prisma.module';
import { EnvironmentModule } from '@environment/environment.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [EnvironmentModule, LoggerModule, PrismaModule, HealthModule],
})
export class AppModule {}
