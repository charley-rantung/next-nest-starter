import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/guard/auth.guard';
import { SkipCsrf } from 'src/common/guard/csrf.guard';
import { Throttle } from '@nestjs/throttler';
import { ZodPipe } from 'src/common/pipe/zod.pipe';
import { Session } from 'src/common/decorator/session.decorator';
import {
  SignInSchema,
  RequestPasswordResetSchema,
  ResetPasswordSchema,
  VerifyPasswordResetOtpSchema,
  type AccessTokenPayload,
  type MySessionListResponse,
  type RequestPasswordResetResponse,
  type VerifyPasswordResetOtpResponse,
  type ResetPasswordResponse,
} from '@starter-pack/api-contracts';
import type { SignInBody, RequestPasswordResetBody, ResetPasswordBody, VerifyPasswordResetOtpBody } from './auth.types';
import type { Request, Response } from 'express';

@SkipCsrf()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('sign-in')
  async signIn(
    @Body(new ZodPipe(SignInSchema.body))
    body: SignInBody,
    @Req()
    req: Request,
    @Res()
    res: Response,
  ) {
    const { accessToken, refreshToken, csrfToken } = await this.authService.signIn(body, req);

    res.cookie('csrf-token', csrfToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('access-token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.status(204).send();
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('refresh')
  async refreshAccessToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh-token'] as string | undefined;
    if (!refreshToken) throw new UnauthorizedException('Refresh token is required');

    const { accessToken, refreshToken: newRefreshToken, csrfToken } = await this.authService.refreshAccessToken(refreshToken);

    res.cookie('csrf-token', csrfToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('access-token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh-token', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.status(204).send();
  }

  @Public()
  @Post('sign-out')
  async signOut(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'] as string | undefined;
    if (refreshToken) {
      await this.authService.signOut(refreshToken);
    }

    res.clearCookie('csrf-token');
    res.clearCookie('access-token');
    res.clearCookie('refresh-token');

    res.status(204).send();
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('request-password-reset')
  async requestPasswordReset(
    @Body(new ZodPipe(RequestPasswordResetSchema.body))
    body: RequestPasswordResetBody,
  ): Promise<RequestPasswordResetResponse> {
    const message = await this.authService.requestPasswordReset(body);

    return {
      requestId: '',
      success: true,
      message,
      data: null,
      meta: {
        timestamp: Date.now(),
      },
    };
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('verify-password-reset-otp')
  async verifyPasswordResetOtp(
    @Body(new ZodPipe(VerifyPasswordResetOtpSchema.body))
    body: VerifyPasswordResetOtpBody,
  ): Promise<VerifyPasswordResetOtpResponse> {
    const { resetToken } = await this.authService.verifyPasswordResetOtp(body);

    return {
      requestId: '',
      success: true,
      message: 'OTP verified successfully',
      data: {
        token: resetToken,
      },
      meta: {
        timestamp: Date.now(),
      },
    };
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('reset-password')
  async resetPassword(
    @Body(new ZodPipe(ResetPasswordSchema.body))
    body: ResetPasswordBody,
  ): Promise<ResetPasswordResponse> {
    await this.authService.resetPassword(body);

    return {
      requestId: '',
      success: true,
      message: 'Password has been reset successfully',
      data: null,
      meta: {
        timestamp: Date.now(),
      },
    };
  }

  @Get('sessions')
  async getMySessions(
    @Session()
    session: AccessTokenPayload,
  ): Promise<MySessionListResponse> {
    const sessions = await this.authService.getMySessions(session);

    return {
      requestId: '',
      success: true,
      message: 'Sessions found',
      data: sessions,
      meta: {
        timestamp: Date.now(),
      },
    };
  }
}
