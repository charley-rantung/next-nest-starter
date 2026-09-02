import * as z from 'zod';
import { RequestPasswordResetSchema, ResetPasswordSchema, SignInSchema, VerifyPasswordResetOtpSchema } from '@starter-pack/api-contracts';

export type SignInBody = z.output<typeof SignInSchema.body>;

export type RequestPasswordResetBody = z.output<typeof RequestPasswordResetSchema.body>;

export type VerifyPasswordResetOtpBody = z.output<typeof VerifyPasswordResetOtpSchema.body>;

export type ResetPasswordBody = z.output<typeof ResetPasswordSchema.body>;
