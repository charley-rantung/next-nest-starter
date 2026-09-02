import axios, { AxiosError } from "axios"
import { API_MAIN_URL } from "@/constant/public"
import { refreshToken } from "./user/auth"
import { getClientCookie } from "@/utils/helper"
import { ApiErrorResponse } from "@starter-pack/api-contracts"
import { AuthErrorCode } from "@starter-pack/api-contracts/codes"

const REFRESHABLE_CODES = new Set<string>([
  AuthErrorCode.TOKEN_MISSING,
  AuthErrorCode.TOKEN_INVALID,
  AuthErrorCode.TOKEN_EXPIRED,
])

const base = axios.create({
  baseURL: API_MAIN_URL,
  withCredentials: true,
})

const api = axios.create({
  baseURL: API_MAIN_URL,
  withCredentials: true,
})

api.interceptors.request.use((req) => {
  const csrfToken = getClientCookie("csrf-token")

  if (csrfToken) {
    req.headers["x-csrf-token"] = csrfToken
  }

  return req
})

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError<ApiErrorResponse>) => {
    const config = err.config as typeof err.config & { __retry?: boolean }
    const code = err.response?.data.error.code

    if (err.response?.status === 401 && code && REFRESHABLE_CODES.has(code) && config && !config?.__retry) {
      config.__retry = true

      try {
        await refreshToken()
        return api(config)
      } catch {
        if (typeof window !== "undefined") {
          window.location.href = "/auth/sign-in"
        }
      }
    }

    return Promise.reject(err)
  },
)

export { api, base }
