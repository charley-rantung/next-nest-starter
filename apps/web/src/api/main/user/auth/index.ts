import { api, base } from "@/api/main/axios"
import type {
  MySessionListResponse,
  RequestPasswordResetBody,
  RequestPasswordResetResponse,
  ResetPasswordBody,
  ResetPasswordResponse,
  SignInBody,
  VerifyPasswordResetOtpBody,
  VerifyPasswordResetOtpResponse,
} from "@starter-pack/api-contracts"
import type { AxiosRequestConfig } from "axios"

const PATH = "/auth/"

export const signIn = (props: { body: SignInBody }) => {
  return base.post(PATH + "sign-in", props.body)
}

export const refreshToken = (config?: AxiosRequestConfig) => {
  return base.post(PATH + "refresh", undefined, config)
}

export const signOut = () => {
  return base.post(PATH + "sign-out")
}

export const requestPasswordReset = (props: { body: RequestPasswordResetBody }) => {
  return base.post<RequestPasswordResetResponse>(PATH + "request-password-reset", props.body)
}

export const verifyPasswordResetOtp = (props: { body: VerifyPasswordResetOtpBody }) => {
  return base.post<VerifyPasswordResetOtpResponse>(PATH + "verify-password-reset-otp", props.body)
}

export const resetPassword = (props: { body: ResetPasswordBody }) => {
  return base.post<ResetPasswordResponse>(PATH + "reset-password", props.body)
}

export const getOwnSessions = () => {
  return api.get<MySessionListResponse>(PATH + "sessions")
}
