import type { INestApplication } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

export namespace ApplicationLoggerBootstrap {
  export function setup(app: INestApplication): void {
    app.useLogger(app.get(Logger));
  }
}
