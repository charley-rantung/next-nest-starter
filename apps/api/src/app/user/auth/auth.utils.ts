import { Injectable } from '@nestjs/common';
import jose from 'jose';
import crypto from 'node:crypto';
import type { AccessTokenPayload, RefreshTokenPayload } from '@starter-pack/api-contracts';

@Injectable()
export class AuthUtils {
  async generateAccessToken(payload: AccessTokenPayload, secret: string): Promise<string> {
    return new jose.SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).sign(new TextEncoder().encode(secret));
  }

  async validateAccessToken(accessToken: string, secret: string): Promise<AccessTokenPayload> {
    const { payload } = await jose.jwtVerify<AccessTokenPayload>(accessToken, new TextEncoder().encode(secret));

    return payload;
  }

  async generateRefreshToken(payload: RefreshTokenPayload, secret: string): Promise<string> {
    return new jose.SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).sign(new TextEncoder().encode(secret));
  }

  async validateRefreshToken(refreshToken: string, secret: string): Promise<RefreshTokenPayload> {
    const { payload } = await jose.jwtVerify<RefreshTokenPayload>(refreshToken, new TextEncoder().encode(secret));

    return payload;
  }

  /**
   *
   * @param byteLength - default = 32
   * @param secretEncoding - default = 'hex'
   * @param hashEncoding - default = 'hex'
   * @returns
   */
  generateSecret(byteLength: number = 32, secretEncoding: BufferEncoding = 'hex'): string {
    return crypto.randomBytes(byteLength).toString(secretEncoding);
  }

  generateOtp(length: number = 6): string {
    const otp = crypto.randomInt(0, Math.pow(10, length));
    return otp.toString().padStart(length, '0');
  }

  /**
   * Hash a secret using SHA-256.
   * @param secret
   * @param hashEncoding
   * @returns
   */
  hashSecret(secret: string, hashEncoding: crypto.BinaryToTextEncoding = 'hex'): string {
    return crypto.createHash('sha256').update(secret).digest(hashEncoding);
  }
}
