import * as z from "zod"
import { BaseStringSchema } from "../../../common"

export const SignInSchema = {
  body: z.object({
    username: BaseStringSchema.username,
    password: BaseStringSchema.password,
  }),
}

export const RequestPasswordResetSchema = {
  body: z.object({
    email: BaseStringSchema.email,
  }),
}

export const VerifyPasswordResetOtpSchema = {
  body: z.object({
    email: BaseStringSchema.email,
    otp: BaseStringSchema.short,
  }),
}

export const ResetPasswordSchema = {
  body: z.object({
    email: BaseStringSchema.email,
    token: BaseStringSchema.short,
    password: BaseStringSchema.password,
  }),
}
