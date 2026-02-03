import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { EnvironmentService } from '@environment/environment.service';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private readonly isQueryLoggingEnabled: boolean;

  constructor(private readonly environmentService: EnvironmentService) {
    const isQueryLoggingEnabled = environmentService.isLocal() || environmentService.isDevelopment();

    super(isQueryLoggingEnabled ? { log: [{ emit: 'event', level: 'query' }] } : undefined);

    this.isQueryLoggingEnabled = isQueryLoggingEnabled;

    if (this.isQueryLoggingEnabled) {
      this.$on('query', (event: Prisma.QueryEvent) => {
        this.logger.debug(
          `-------------------- QUERY --------------------\n${event.query}\nParams: ${event.params}\nDuration: ${event.duration}ms`
        );
      });

      const logger = this.logger;
      const extended = this.$extends({
        query: {
          $allModels: {
            async $allOperations({ model, operation, args, query }) {
              const result = await query(args);
              logger.debug(
                `------------------- RESULT --------------------\n${PrismaService.safeStringify({ model, operation, args, result }, 2)}`
              );

              return result;
            },
          },
        },
      });

      Object.assign(this, extended);
    }
  }

  private static safeStringify(value: unknown, space?: number): string {
    return JSON.stringify(value, (_key: string, v: unknown) => (typeof v === 'bigint' ? v.toString() : v), space);
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
