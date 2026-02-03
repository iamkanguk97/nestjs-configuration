import { DocumentBuilder } from '@nestjs/swagger';

import type { OpenAPIObject } from '@nestjs/swagger';

interface ISwaggerServerElements {
  url: string;
  description: string;
}

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
    const servers: ISwaggerServerElements[] = [
      {
        url: 'http://localhost:9090',
        description: 'Local API Server',
      },
      {
        url: 'https://api-dev.example.com',
        description: 'Development API Server',
      },
    ];

    servers.forEach((server: ISwaggerServerElements) => {
      this.documentBuilder.addServer(server.url, server.description);
    });

    return this;
  }

  build(): Omit<OpenAPIObject, 'paths'> {
    return this.documentBuilder.build();
  }
}
