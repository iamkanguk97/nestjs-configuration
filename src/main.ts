import { ApplicationBootstrap } from '@bootstrap/execute';

ApplicationBootstrap.execute().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
