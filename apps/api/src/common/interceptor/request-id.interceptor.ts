import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import type { Request, Response } from 'express';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const res = ctx.switchToHttp().getResponse<Response>();
    const requestId = (req.headers['x-request-id'] as string) || uuidv4();

    res.setHeader('x-request-id', requestId);
    res.locals.requestId = requestId;

    return next.handle().pipe(
      map((data: object) => ({
        ...data,
        requestId,
      })),
    );
  }
}
