import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { NODE_ENV } from 'src/environment/environment.constant';

import type { IEnvironment } from 'src/environment/environment.validation';

@Injectable()
export class EnvironmentService {
  constructor(private readonly configService: ConfigService<IEnvironment>) {}

  getString(key: keyof IEnvironment): string | never {
    return this.configService.getOrThrow<string>(key);
  }

  getNumber(key: keyof IEnvironment): number | never {
    return +this.configService.getOrThrow<number>(key);
  }

  getBoolean(key: keyof IEnvironment): boolean | never {
    return this.configService.getOrThrow<boolean>(key);
  }

  getApplicationPort(): number {
    return this.isLocal() ? 9090 : this.getNumber('PORT');
  }

  isLocal(): boolean {
    return this.getString('ENV') === NODE_ENV.LOCAL;
  }

  isDevelopment(): boolean {
    return this.getString('ENV') === NODE_ENV.DEVELOPMENT;
  }

  isProduction(): boolean {
    return this.getString('ENV') === NODE_ENV.PRODUCTION;
  }
}
