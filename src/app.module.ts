import { HealthModule } from '@api/health/health.module';
import { EnvironmentModule } from '@environment/environment.module';
import { LoggerModule } from '@logger/logger.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [EnvironmentModule, LoggerModule, HealthModule],
})
export class AppModule {}
