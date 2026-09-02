import "@tanstack/react-query"
import type { AxiosError } from "axios"
import type { ApiErrorResponse } from "@starter-pack/api-contracts"

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AxiosError<ApiErrorResponse>
  }
}
