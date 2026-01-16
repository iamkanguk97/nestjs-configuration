import type { INestApplication } from '@nestjs/common';
import { SwaggerBuilder } from '@swagger/builder';

export namespace ApplicationSwaggerBootstrap {
  export function setup(app: INestApplication): void {
    SwaggerBuilder.setup(app);
  }
}
