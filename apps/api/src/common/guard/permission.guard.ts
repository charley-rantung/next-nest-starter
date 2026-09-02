import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

export const Permissions = Reflector.createDecorator<string[]>();

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext) {
    const requiredPermissions = this.reflector.getAllAndMerge(Permissions, [ctx.getClass(), ctx.getHandler()]);
    if (!requiredPermissions || requiredPermissions.length === 0) return true; // No permissions required for this route

    /** Admin users have full access */

    const req = ctx.switchToHttp().getRequest<Request>();

    const session = req.session;
    if (!session) throw new UnauthorizedException('Session not found');

    if (session.user.type === 'admin') return true;

    /** Regular users must have the required permissions */

    const userPermissions = session.user.permissions;

    const isAuthorized = requiredPermissions.every((p) => userPermissions.includes(p));
    if (!isAuthorized) throw new ForbiddenException('Insufficient permissions');

    return true;
  }
}
