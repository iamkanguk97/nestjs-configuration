import { InternalServerErrorException } from '@nestjs/common';
import { EnvironmentValidationSchemaFunc } from 'src/environment/environment.validation';

describe('EnvironmentValidationSchemaFunc', () => {
    it('유효한 환경변수는 정상 반환해야 한다.', () => {
        const validConfig = {
            ENV: 'test',
            DB_USERNAME: 'testuser',
            DB_PASSWORD: 'testpassword',
            DB_DATABASE: 'test',
        };

        expect(() => EnvironmentValidationSchemaFunc(validConfig)).not.toThrow();
    });

    it('유효하지 않은 환경변수는 InternalServerErrorException을 던져야 한다.', () => {
        const invalidConfig = {};

        expect(() => EnvironmentValidationSchemaFunc(invalidConfig))
            .toThrow(InternalServerErrorException);
    });
});