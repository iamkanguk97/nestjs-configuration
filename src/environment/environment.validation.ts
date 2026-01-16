import { NODE_ENV } from '@environment/environment.constant';
import { InternalServerErrorException } from '@nestjs/common';
import { z } from 'zod';

/**
 * Environment Validation Schema
 *
 * - .env에 내용을 추가하게 되면 Validation을 위해 해당 부분에도 내용을 추가해주셔야 합니다.
 * - 추가하지 않을 시 애플리케이션이 정상적으로 실행되지 않습니다.
 */
export const EnvironmentSchema = z.object({
  ENV: z.enum([NODE_ENV.LOCAL, NODE_ENV.DEVELOPMENT, NODE_ENV.PRODUCTION, NODE_ENV.TEST]),
  PORT: z.coerce.number().positive().optional(),

  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  DB_SYNCHRONIZE: z.coerce.boolean().optional(),
});
export type IEnvironment = z.infer<typeof EnvironmentSchema>;

export function EnvironmentValidationSchemaFunc(config: Record<string, unknown>): IEnvironment {
  const result = EnvironmentSchema.safeParse(config);

  if (!result.success) {
    throw new InternalServerErrorException(`Environment validation error: ${result.error.message}`);
  }

  return result.data;
}
