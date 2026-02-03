import { ServerResponse } from 'http';
import { IncomingMessage } from 'http';

import { Global, HttpStatus, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { Level } from 'pino';

import { EnvironmentModule } from '@environment/environment.module';
import { EnvironmentService } from '@environment/environment.service';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [EnvironmentModule],
      useFactory: (environmentService: EnvironmentService) => ({
        // forRoutes: ['*'],
        exclude: ['/api-docs'],
        pinoHttp: {
          autoLogging: true,
          customLogLevel: (_: IncomingMessage, res: ServerResponse, _error?: Error): Level => {
            if (res.statusCode >= HttpStatus.BAD_REQUEST && res.statusCode < HttpStatus.INTERNAL_SERVER_ERROR) {
              return 'warn';
            }
            if (res.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
              return 'error';
            }
            return 'info';
          },
          customSuccessMessage: (req: IncomingMessage, res: ServerResponse): string => {
            return `${req.method} ${req.url} ${res.statusCode}`;
          },
          customErrorMessage: (req: IncomingMessage, res: ServerResponse, error: Error): string => {
            return `${req.method} ${req.url} ${res.statusCode} - ${error.message}`;
          },
          customProps: (req: IncomingMessage, res: ServerResponse): Record<string, unknown> => {
            const forwardedFor = req.headers['x-forwarded-for'];
            const clientIp = forwardedFor
              ? Array.isArray(forwardedFor)
                ? forwardedFor[0]
                : forwardedFor.split(',')[0].trim()
              : req.socket.remoteAddress;

            return {
              method: req.method,
              url: req.url,
              statusCode: res.statusCode,
              ip: clientIp,
              userAgent: req.headers['user-agent'],
            };
          },
          formatters: {
            level: (
              label: string,
              number: number
            ): {
              level: number;
              severity: string;
            } => ({
              level: number,
              severity: label,
            }),
          },
          messageKey: 'message',
          // timestamp: () => `,"time":"${new Date().toISOString()}"`,
          // genReqId: () => '',
          /**
           * Use pino-pretty in development environment only
           *
           * Why not use pino-pretty in production environment?
           * 1. Performance: JSON → Pretty format conversion is 10x slower (30k/s → 3k/s)
           * 2. Blocking: Synchronous processing directly affects response time
           * 3. Logging: ELK, Datadog, CloudWatch, etc. require JSON logs
           * 4. Memory: Additional memory is used during formatting
           * 5. Search: JSON fields can be searched, Pretty logs can only be searched by text
           *
           * In production, raw JSON logs are output to integrate with logging systems
           *
           * @author 이강욱
           */
          ...(!environmentService.isProduction() && {
            transport: {
              target: 'pino-pretty',
              options: {
                levelFirst: true,
                ignore: 'pid,hostname,severity,context,req,res',
                messageKey: 'message',
                messageFormat: '{if req.id}[{req.id}] {end}{if context}({context}) {end}{message}',
                customColors: 'error:red,warn:yellow,info:green',
                translateTime: 'SYS:standard',
                errorLikeObjectKeys: ['err', 'error'],
                errorProps: '*',
                multiline: true,
                singleLineError: false,
                minimumLevel: 'info',
                sync: true,
                colorize: true,
                hideObject: false,
                // mkdir: true,
              },
            },
          }),
        },
      }),
      inject: [EnvironmentService],
    }),
  ],
})
export class LoggerModule {}
