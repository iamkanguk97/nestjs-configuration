import { InternalServerErrorException } from '@nestjs/common';

import { EnvironmentValidationSchemaFunc } from 'src/environment/environment.validation';

describe('EnvironmentValidationSchemaFunc', () => {
  it('유효하지 않은 환경변수는 InternalServerErrorException을 던져야 한다.', () => {
    const invalidConfig = {};

    expect(() => EnvironmentValidationSchemaFunc(invalidConfig)).toThrow(InternalServerErrorException);
  });
});
