import * as z from "zod"
import * as s from "./auth.schema"
import { ApiResponse } from "../../../common"

// Model
export type Session = {
  created_at: Date
  last_used_at: Date
  ip_address: string | null
  user_agent: string | null
}
export type Sessions = Array<Session>

// Sign in
export type SignInBody = z.input<typeof s.SignInSchema.body>

// Request password reset
export type RequestPasswordResetBody = z.input<typeof s.RequestPasswordResetSchema.body>
export type RequestPasswordResetResponse = ApiResponse

// Verify password reset otp
export type VerifyPasswordResetOtpBody = z.input<typeof s.VerifyPasswordResetOtpSchema.body>
export type VerifyPasswordResetOtpResponse = ApiResponse<{ token: string }>

// Reset password
export type ResetPasswordBody = z.input<typeof s.ResetPasswordSchema.body>
export type ResetPasswordResponse = ApiResponse

// List
export type MySessionListResponse = ApiResponse<Sessions>
