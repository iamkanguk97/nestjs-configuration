import { IErrorResponse } from '@common/interfaces';
import { DateTime } from '@common/utils/datetime.util';
import { EnvironmentService } from '@environment/environment.service';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

interface IHttpExceptionResponse {
  message: string;
  error?: string;
  statusCode?: HttpStatus;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly environmentService: EnvironmentService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const errorResponse =
      exception instanceof HttpException
        ? this.handleHttpException(exception, request)
        : this.handleUnknownException(exception, request);

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private handleHttpException(exception: HttpException, request: Request): IErrorResponse {
    return {
      isSuccess: false,
      statusCode: exception.getStatus(),
      message: this.extractExceptionMessage(exception),
      error: exception.constructor.name,
      path: request.url,
      timestamp: DateTime.now(),
    };
  }

  private handleUnknownException(exception: unknown, request: Request): IErrorResponse {
    this.logger.error(
      'Unexpected exception occurred',
      exception instanceof Error ? exception.stack : String(exception)
    );

    const errorResponse: IErrorResponse = {
      isSuccess: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception instanceof Error ? exception.message : 'Internal Server error',
      error: 'InternalServerError',
      path: request.url,
      timestamp: DateTime.now(),
      ...(!this.environmentService.isProduction() &&
        exception instanceof Error && {
          stack: exception.stack,
        }),
    };

    return errorResponse;
  }

  private isHttpExceptionResponse(response: string | object): response is IHttpExceptionResponse {
    return typeof response === 'object' && 'message' in response;
  }

  private extractExceptionMessage(exception: HttpException): string {
    const exceptionResponse = exception.getResponse();

    let message: string;
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (this.isHttpExceptionResponse(exceptionResponse)) {
      const responseMessage = exceptionResponse.message;
      message = Array.isArray(responseMessage) ? responseMessage[0] || 'Bad Request' : responseMessage;
    } else {
      message = exception.message;
    }

    return message;
  }
}
