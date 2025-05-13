/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body } = req;
    const now = Date.now();
    return next.handle().pipe(
      tap(() =>
        this.logger.log(`${method} ${url}${body} ${Date.now() - now}ms`, {
          meta: {
            controler: context.getClass().name,
            method: method,
            url: url,
            body: body,
          },
        }),
      ),
    );
  }
}
