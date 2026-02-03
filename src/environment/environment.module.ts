import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EnvironmentService } from 'src/environment/environment.service';
import { EnvironmentValidationSchemaFunc } from 'src/environment/environment.validation';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validate: EnvironmentValidationSchemaFunc,
    }),
  ],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
