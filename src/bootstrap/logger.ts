import { Logger } from 'nestjs-pino';

import type { INestApplication } from '@nestjs/common';

export namespace ApplicationLoggerBootstrap {
  export function setup(app: INestApplication): void {
    app.useLogger(app.get(Logger));
  }
}
