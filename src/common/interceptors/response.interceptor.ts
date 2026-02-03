import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { isNil } from 'es-toolkit';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IApiResponse } from '@common/interfaces';
import { DateTime } from '@common/utils/datetime.util';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IApiResponse<T>> {
  intercept(_: ExecutionContext, next: CallHandler<T>): Observable<IApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        return {
          isSuccess: true,
          data: isNil(data) ? null : data,
          timestamp: DateTime.Now.iso(),
        };
      })
    );
  }
}
