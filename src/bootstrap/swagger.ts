import { SwaggerBuilder } from '@common/swagger/builder';

import type { INestApplication } from '@nestjs/common';

export namespace ApplicationSwaggerBootstrap {
  export function setup(app: INestApplication): void {
    SwaggerBuilder.setup(app);
  }
}
