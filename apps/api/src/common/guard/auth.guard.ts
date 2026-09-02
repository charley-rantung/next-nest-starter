import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AuthUtils } from 'src/app/user/auth/auth.utils';
import { JWTExpired } from 'jose/errors';
import { AppException } from '../exceptions/app.exception';
import { AuthErrorCode } from '@starter-pack/api-contracts/codes';
import type { Request } from 'express';
import type { EnvType } from '../utils/env.utils';

export const SKIP_AUTH_KEY = 'skip-auth';
export const Public = () => SetMetadata(SKIP_AUTH_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly authUtils: AuthUtils = new AuthUtils();

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService<EnvType, true>,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();

    /** Check if handler/controller has @Public() decorator */

    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [ctx.getHandler(), ctx.getClass()]);
    if (skip) return true;

    /** Validate the access token */

    const accessToken = req.cookies['access-token'] as string | undefined;
    if (!accessToken) throw new AppException(401, 'Missing access token', AuthErrorCode.TOKEN_MISSING);

    try {
      const payload = await this.authUtils.validateAccessToken(accessToken, this.configService.get('JWT_ACCESS_TOKEN_SECRET', { infer: true }));

      /** Pass the token payload to the request object */

      req.session = payload;

      return true;
    } catch (err) {
      if (err instanceof JWTExpired) {
        throw new AppException(401, 'Token has expired', AuthErrorCode.TOKEN_EXPIRED, {
          cause: err,
        });
      }

      throw new AppException(401, 'Invalid token', AuthErrorCode.TOKEN_INVALID, {
        cause: err,
      });
    }
  }
}
