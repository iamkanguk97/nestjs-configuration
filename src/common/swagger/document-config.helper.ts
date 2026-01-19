import type { OpenAPIObject } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';

export class SwaggerDocumentConfigHelper {
  private readonly documentBuilder: DocumentBuilder = new DocumentBuilder();

  setDefaultInfo(): this {
    this.documentBuilder
      .setTitle('NestJS Swagger API Docs')
      .setDescription(['### Description'].reduce((p, c) => (p += c + '  \n\n'), ''))
      .setVersion('0.0.1');

    return this;
  }

  addBearerAuthTokens(
    tokens: Array<{
      name: string;
      description: string;
    }>
  ): this {
    tokens.forEach(({ name, description }) => {
      this.documentBuilder.addBearerAuth(
        {
          scheme: 'bearer',
          type: 'http',
          in: 'header',
          name,
          description,
        },
        name
      );
    });

    return this;
  }

  addTags(
    tags: Array<{
      name: string;
      description: string;
    }>
  ): this {
    tags.forEach(({ name, description }) => {
      this.documentBuilder.addTag(name, description);
    });

    return this;
  }

  addServers(): this {
    this.documentBuilder.addServer('http://localhost:9090', 'Local Environment');
    this.documentBuilder.addServer('https://api-dev.shop', 'Development Environment');

    return this;
  }

  build(): Omit<OpenAPIObject, 'paths'> {
    return this.documentBuilder.build();
  }
}
