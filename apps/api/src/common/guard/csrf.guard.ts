import { CanActivate, ExecutionContext, ForbiddenException, HttpException, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';

export const SKIP_CSRF_KEY: string = 'skip-csrf';
export const SkipCsrf = () => SetMetadata(SKIP_CSRF_KEY, true);

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    /** Check if handler/controller has @SkipCsrf() decorator */

    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_CSRF_KEY, [ctx.getHandler(), ctx.getClass()]);
    if (skip) return true;

    /** Skip CSRF validation for non-mutating methods */

    const req = ctx.switchToHttp().getRequest<Request>();
    const method = req.method;
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return true;

    /** Validate CSRF tokens */

    const cookieToken = req.cookies['csrf-token'] as string | undefined;
    const headerToken = req.headers['x-csrf-token'] as string | undefined;

    return this.validateCsrfToken(cookieToken, headerToken);
  }

  private validateCsrfToken(cookieToken: string | undefined, headerToken: string | undefined): boolean {
    const errorMessage = 'CSRF validation failed';

    if (!cookieToken) {
      throw new ForbiddenException(errorMessage, {
        cause: new Error('Missing CSRF token in cookie'),
      });
    }

    if (!headerToken) {
      throw new ForbiddenException(errorMessage, {
        cause: new Error('Missing CSRF token in header'),
      });
    }

    const a = Buffer.from(cookieToken);
    const b = Buffer.from(headerToken);

    if (a.length !== b.length) {
      throw new ForbiddenException(errorMessage, {
        cause: new Error('Invalid CSRF token length'),
      });
    }

    if (!timingSafeEqual(a, b)) {
      throw new HttpException(errorMessage, 403, {
        cause: new Error('Invalid CSRF token value'),
      });
    }

    return true;
  }
}
