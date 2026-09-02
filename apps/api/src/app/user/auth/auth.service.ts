import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from 'src/common/provider/prisma/prisma.service';
import { RedisService } from 'src/common/provider/redis/redis.service';
import { AuthUtils } from './auth.utils';
import { Prisma } from 'src/generated/prisma/client';
import { dayjs } from 'src/common/utils/dayjs.util';
import { ResetPasswordKey } from './constants/redis-keys.constant';
import { ResetPasswordTtl } from './constants/redis-ttl.constant';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import type { EnvType } from 'src/common/utils/env.utils';
import type { Request } from 'express';
import type { AccessTokenPayload, RefreshTokenPayload, Sessions } from '@starter-pack/api-contracts';
import type { RequestPasswordResetBody, ResetPasswordBody, SignInBody, VerifyPasswordResetOtpBody } from './auth.types';
import type { ResetPasswordType } from './interfaces/redis-values.interface';
import type { MailJobData, MailJobName } from 'src/common/provider/queue/mail.processor';

@Injectable()
export class AuthService {
  private readonly authUtils: AuthUtils = new AuthUtils();

  constructor(
    private readonly configService: ConfigService<EnvType, true>,
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    @InjectQueue('mail') private readonly mailQueue: Queue<MailJobData, undefined, MailJobName>,
  ) {}

  async signIn(body: SignInBody, req: Request): Promise<{ accessToken: string; refreshToken: string; csrfToken: string }> {
    const user = await this.prismaService.user.findUnique({
      where: {
        NOT: { type: 'internal' },
        username: body.username,
      },
      select: {
        uid: true,
        name: true,
        password: true,
        type: true,
        is_active: true,
        roles: {
          select: {
            permissions: {
              select: {
                slug: true,
              },
            },
          },
        },
        permissions: {
          select: {
            slug: true,
          },
        },
      },
    });
    if (!user) {
      throw new UnauthorizedException('Username and password do not match', {
        cause: new Error('User not found'),
      });
    }

    /** Check if the user is active */

    if (!user.is_active) throw new UnauthorizedException('User is not active');

    /** Validate user credentials */

    const isAuth = bcrypt.compareSync(body.password, user.password);
    if (!isAuth) {
      throw new UnauthorizedException('Username and password do not match', {
        cause: new Error('Invalid password'),
      });
    }

    /** Generate access token */

    const current = dayjs();

    const accessToken = await this.authUtils.generateAccessToken(
      {
        user: {
          name: user.name,
          type: user.type,
          permissions: [...new Set([...user.roles.flatMap((r) => r.permissions.map((p) => p.slug)), ...user.permissions.map((p) => p.slug)])],
        },
        jti: crypto.randomUUID(),
        sub: user.uid,
        iat: current.unix(),
        exp: current.add(15, 'minutes').unix(),
      },
      this.configService.get('JWT_ACCESS_TOKEN_SECRET', { infer: true }),
    );

    /** Generate refresh token */

    const refreshTokenPayload: RefreshTokenPayload = {
      jti: crypto.randomUUID(),
      sub: user.uid,
      iat: current.unix(),
      exp: current.add(1, 'day').unix(),
    };
    const refreshToken = await this.authUtils.generateRefreshToken(
      refreshTokenPayload,
      this.configService.get('JWT_REFRESH_TOKEN_SECRET', { infer: true }),
    );

    await this.prismaService.session.create({
      data: {
        id: refreshTokenPayload.jti,
        user: {
          connect: {
            uid: refreshTokenPayload.sub,
          },
        },
        expires_at: new Date(refreshTokenPayload.exp * 1000),
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
      },
    });

    /** Generate CSRF token */

    const csrfToken = this.authUtils.generateSecret();

    return { accessToken, refreshToken, csrfToken };
  }

  async refreshAccessToken(token: string): Promise<{ accessToken: string; refreshToken: string; csrfToken: string }> {
    /** Validate refresh token */

    const payload = await this.authUtils.validateRefreshToken(token, this.configService.get('JWT_REFRESH_TOKEN_SECRET', { infer: true }));

    /** Delete old session (rotation) */

    try {
      await this.prismaService.session.delete({
        where: {
          id: payload.jti,
          user: {
            uid: payload.sub,
          },
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new HttpException('Invalid session', 404, {
            cause: new Error('Session not found'),
          });
        }
        throw err;
      }
      throw err;
    }

    /** Verify user still exists and is active */

    const user = await this.prismaService.user.findUnique({
      where: {
        uid: payload.sub,
      },
      select: {
        uid: true,
        name: true,
        type: true,
        is_active: true,
        roles: {
          select: {
            permissions: {
              select: {
                slug: true,
              },
            },
          },
        },
        permissions: {
          select: {
            slug: true,
          },
        },
      },
    });
    if (!user)
      throw new HttpException('Invalid session', 404, {
        cause: 'User not found',
      });

    if (!user.is_active) throw new HttpException('User is not active', 403);

    /** Generate new access token */

    const current = dayjs();

    const accessToken = await this.authUtils.generateAccessToken(
      {
        user: {
          name: user.name,
          type: user.type,
          permissions: [...new Set([...user.roles.flatMap((r) => r.permissions.map((p) => p.slug)), ...user.permissions.map((p) => p.slug)])],
        },
        jti: crypto.randomUUID(),
        sub: user.uid,
        iat: current.unix(),
        exp: current.add(15, 'minutes').unix(),
      },
      this.configService.get('JWT_ACCESS_TOKEN_SECRET', { infer: true }),
    );

    /** Generate new refresh token */

    const refreshTokenPayload: RefreshTokenPayload = {
      jti: crypto.randomUUID(),
      sub: user.uid,
      iat: current.unix(),
      exp: current.add(1, 'day').unix(),
    };
    const refreshToken = await this.authUtils.generateRefreshToken(
      refreshTokenPayload,
      this.configService.get('JWT_REFRESH_TOKEN_SECRET', { infer: true }),
    );

    await this.prismaService.session.create({
      data: {
        id: refreshTokenPayload.jti,
        user: {
          connect: {
            uid: refreshTokenPayload.sub,
          },
        },
        expires_at: new Date(refreshTokenPayload.exp * 1000),
      },
    });

    /** Generate CSRF token */

    const csrfToken = this.authUtils.generateSecret();

    return { accessToken, refreshToken, csrfToken };
  }

  async signOut(refreshToken: string) {
    /** Validate refresh token and delete session */

    const payload = await this.authUtils.validateRefreshToken(refreshToken, this.configService.get('JWT_REFRESH_TOKEN_SECRET', { infer: true }));

    await this.prismaService.session.delete({
      where: {
        id: payload.jti,
        user: {
          uid: payload.sub,
        },
      },
    });
  }

  async requestPasswordReset(body: RequestPasswordResetBody): Promise<string> {
    const genericResponse = 'If the email exists, a password reset link has been sent.';
    const redisOtpKey = ResetPasswordKey.otp(body.email);
    const redisOtpKeyCooldown = ResetPasswordKey.cooldown(body.email);

    /** Check if email is registered */

    const user = await this.prismaService.user.findUnique({
      where: { email: body.email },
      select: { id: true, email: true, username: true },
    });
    if (!user) return genericResponse;

    /** Check request cooldown per email */

    const inCooldown = await this.redisService.get(redisOtpKeyCooldown);
    if (inCooldown) return genericResponse;

    /** Generate and store otp to redis */

    const otp = this.authUtils.generateOtp(6);
    const hashedOtp = this.authUtils.hashSecret(otp);

    const pipeline = this.redisService.multi();
    pipeline.setex(redisOtpKeyCooldown, ResetPasswordTtl.cooldown, '1'); // set cooldown for 1 minute
    pipeline.setex(
      redisOtpKey,
      ResetPasswordTtl.otp,
      JSON.stringify({
        hashedOtp: hashedOtp,
        userId: user.id,
        email: user.email,
        attempts: 0,
      } satisfies ResetPasswordType['otp']),
    ); // set otp for 15 minutes
    await pipeline.exec();

    await this.mailQueue.add('send-otp', {
      to: body.email,
      text: `Your password reset OTP is: ${otp}. It will expire in 15 minutes.`,
    });

    return genericResponse;
  }

  async verifyPasswordResetOtp(body: VerifyPasswordResetOtpBody): Promise<{ resetToken: string }> {
    const redisOtpKey = ResetPasswordKey.otp(body.email);

    /** Check if OTP exists */

    const tokenRaw = await this.redisService.get(redisOtpKey);
    if (!tokenRaw) throw new BadRequestException('Invalid or expired OTP');

    /** Check attempt limit */

    const tokenData = JSON.parse(tokenRaw) as ResetPasswordType['otp'];
    if (tokenData.attempts >= 5) {
      await this.redisService.del(redisOtpKey);
      throw new HttpException('Too many attempts. Please request a new OTP.', 429);
    }

    // Increment attempts counter regardless of success or failure to prevent brute force attacks
    const remainingTtl = await this.redisService.ttl(redisOtpKey);
    if (remainingTtl <= 0) {
      await this.redisService.del(redisOtpKey);
      throw new BadRequestException('Invalid or expired OTP');
    }
    await this.redisService.setex(
      redisOtpKey,
      remainingTtl,
      JSON.stringify({
        ...tokenData,
        attempts: tokenData.attempts + 1,
      } satisfies ResetPasswordType['otp']),
    );

    /** Compare the input OTP with the stored OTP */

    const hashedInputOtp = this.authUtils.hashSecret(body.otp);
    const isMatch = crypto.timingSafeEqual(Buffer.from(hashedInputOtp, 'hex'), Buffer.from(tokenData.hashedOtp, 'hex'));
    if (!isMatch) throw new BadRequestException('Invalid or expired OTP');

    /** Generate reset session token */

    const resetToken = this.authUtils.generateSecret();
    const hashedResetToken = this.authUtils.hashSecret(resetToken);

    /** Delete the OTP and store the reset token */

    const pipeline = this.redisService.multi();
    pipeline.del(redisOtpKey);
    pipeline.setex(
      ResetPasswordKey.session(hashedResetToken),
      ResetPasswordTtl.session,
      JSON.stringify({
        userId: tokenData.userId,
        email: tokenData.email,
      } satisfies ResetPasswordType['session']),
    );
    await pipeline.exec();

    return { resetToken };
  }

  async resetPassword(body: ResetPasswordBody) {
    /** Verify reset token */

    const hashedInputToken = this.authUtils.hashSecret(body.token);
    const redisSessionKey = ResetPasswordKey.session(hashedInputToken);

    const sessionRaw = await this.redisService.get(redisSessionKey);
    if (!sessionRaw) throw new BadRequestException('Invalid or expired reset session');

    const sessionData = JSON.parse(sessionRaw) as ResetPasswordType['session'];

    /** Verify email matches */

    if (sessionData.email !== body.email) {
      await this.redisService.del(redisSessionKey);
      throw new BadRequestException('Invalid or expired reset session');
    }

    /** Store the new password */

    const hashedPassword = await bcrypt.hash(body.password, this.configService.get('BCRYPT_SALT_ROUNDS', { infer: true }));

    await this.prismaService.user.update({
      where: { id: sessionData.userId },
      data: { password: hashedPassword },
    });

    /** Invalidate refresh token */

    await this.redisService.del(redisSessionKey);

    // TODO: Revoke all user sessions
    // ...

    await this.mailQueue.add('send-password-changed-notification', {
      to: body.email,
      text: `Your password has been changed successfully. If you did not initiate this change, please contact support immediately.`,
    });
  }

  async getMySessions(session: AccessTokenPayload): Promise<Sessions> {
    const sessions = await this.prismaService.session.findMany({
      where: {
        user: {
          uid: session.sub,
        },
        expires_at: {
          gt: new Date(),
        },
      },
      select: {
        created_at: true,
        last_used_at: true,
        ip_address: true,
        user_agent: true,
      },
    });

    return sessions;
  }
}
