import { Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

import { SwaggerDocumentConfigHelper } from '@common/swagger/document-config.helper';
import { EnvironmentService } from '@environment/environment.service';

import type { INestApplication } from '@nestjs/common';
import type { OpenAPIObject } from '@nestjs/swagger';
import type { SwaggerUiOptions } from '@nestjs/swagger/dist/interfaces/swagger-ui-options.interface';

export class SwaggerBuilder {
  private static readonly logger = new Logger(SwaggerBuilder.name);

  private static isSetupComplete = false;
  private static API_DOCS_PATH = '/api-docs';

  /**
   * Bearer Token Configuration List
   * If you want to add more bearer tokens, you can add them here.
   *
   * @author 이강욱
   */
  private static readonly BEARER_TOKEN_CONFIG_LIST = [
    {
      name: 'accessToken',
      description: 'API Access Token',
    },
  ];

  /**
   * Tags Configuration List
   * If you want to add more tags, you can add them here.
   *
   * @author 이강욱
   */
  private static readonly TAG_LIST = [
    {
      name: 'Health',
      description: 'Health Check API',
    },
  ];

  static setup(app: INestApplication): void {
    if (this.isSetupComplete) {
      this.logger.warn('⚠️ Swagger has already been set up. Skipping...');
      return;
    }

    if (app.get(EnvironmentService).isProduction()) {
      this.logger.warn('⚠️ Swagger is disabled in production.');
      return;
    }

    this.logger.log('\x1b[32m=======================================================\x1b[0m');
    this.logger.log('🏃 SWAGGER API DOCS GENERATING....');

    SwaggerModule.setup(this.API_DOCS_PATH, app, this.createSwaggerDocument(app), {
      swaggerOptions: this.generateSwaggerOptions(),
    });

    this.isSetupComplete = true;

    this.logger.log('🏁 SWAGGER API DOCS GENERATED! 🏁');
    this.logger.log('\x1b[32m=======================================================\x1b[0m');
  }

  private static createSwaggerDocument(app: INestApplication): OpenAPIObject {
    return SwaggerModule.createDocument(app, this.buildDocumentConfiguration());
  }

  private static buildDocumentConfiguration(): Omit<OpenAPIObject, 'paths'> {
    return new SwaggerDocumentConfigHelper()
      .setDefaultInfo()
      .addBearerAuthTokens(this.BEARER_TOKEN_CONFIG_LIST)
      .addTags(this.TAG_LIST)
      .addServers()
      .build();
  }

  private static generateSwaggerOptions(): SwaggerUiOptions {
    return {
      persistAuthorization: true,
      defaultModelsExpandDepth: -1,
      tagsSorter: 'alpha',
      filter: true,
      displayRequestDuration: true,
    };
  }
}
