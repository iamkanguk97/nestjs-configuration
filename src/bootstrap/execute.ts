import { AppModule } from '@app.module';
import { ApplicationLoggerBootstrap } from '@bootstrap/logger';
import { ApplicationSwaggerBootstrap } from '@bootstrap/swagger';
import { EnvironmentService } from '@environment/environment.service';
import type { INestApplication } from '@nestjs/common';
import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

export namespace ApplicationBootstrap {
  export async function execute(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      bufferLogs: true,
    });
    setup(app);

    const environmentService = app.get(EnvironmentService);

    await app.listen(environmentService.getApplicationPort(), '0.0.0.0');
    Logger.log(`🏁 Application is running on: ${await app.getUrl()}`);
  }

  function setup(app: INestApplication): void {
    app.setGlobalPrefix('/api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
      prefix: 'v',
    });

    app.enableShutdownHooks();

    ApplicationLoggerBootstrap.setup(app);
    ApplicationSwaggerBootstrap.setup(app);
  }
}
