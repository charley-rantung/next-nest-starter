import { createParamDecorator, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

/**
  This param decorator is used to retrieve user session data from the request object
  passed by AuthGuard
*/
export const Session = createParamDecorator((_, ctx) => {
  const req = ctx.switchToHttp().getRequest<Request>();
  const session = req.session;

  if (!session) {
    throw new UnauthorizedException(undefined, {
      cause: new Error('Session not found'),
    });
  }

  return session;
});
