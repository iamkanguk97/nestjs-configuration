import { ApplicationBootstrap } from '@bootstrap/execute';
import { Logger } from '@nestjs/common';

ApplicationBootstrap.execute().catch((error: unknown) => {
  Logger.error(`❌ Application Bootstrap Failed: ${JSON.stringify(error)}`);
  process.exit(1);
});
