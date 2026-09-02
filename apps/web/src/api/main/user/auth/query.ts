import * as x from "./index"
import { mutationOptions, queryOptions } from "@tanstack/react-query"

export const signInMutationOptions = () =>
  mutationOptions({
    mutationKey: ["auth:sign-in"],
    mutationFn: x.signIn,
  })

export const refreshTokenMutationOptions = () =>
  mutationOptions({
    mutationKey: ["auth:refresh-token"],
    mutationFn: x.refreshToken,
  })

export const signOutMutationOptions = () =>
  mutationOptions({
    mutationKey: ["auth:sign-out"],
    mutationFn: x.signOut,
  })

export const requestPasswordResetMutationOptions = () =>
  mutationOptions({
    mutationKey: ["auth:request-password-reset"],
    mutationFn: x.requestPasswordReset,
  })

export const verifyPasswordResetOtpMutationOptions = () =>
  mutationOptions({
    mutationKey: ["auth:verify-password-reset-otp"],
    mutationFn: x.verifyPasswordResetOtp,
  })

export const resetPasswordMutationOptions = () =>
  mutationOptions({
    mutationKey: ["auth:reset-password"],
    mutationFn: x.resetPassword,
  })

export const getOwnSessionsQueryOptions = () =>
  queryOptions({
    queryKey: ["user-session:list"],
    queryFn: () => x.getOwnSessions(),
  })
