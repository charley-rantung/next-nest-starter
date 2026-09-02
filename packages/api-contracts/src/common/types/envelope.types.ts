import { TimestampMeta } from "./base.types"

export interface BaseEnvelope {
  /** Unique generated string */
  requestId: string
  /** True: HTTP 1xx, 2xx, 3xx | False: HTTP 4xx, 5xx */
  success: boolean
  /** A human-readable summary */
  message: string
}

/**
 * @param D - Data type
 * @param M - Meta type
 */
export interface ApiResponse<D = null, M = {}> extends BaseEnvelope {
  success: true
  data: D
  meta: M & TimestampMeta
}

export interface ApiErrorResponse extends BaseEnvelope {
  success: false
  /** Http response status codes */
  status: number
  error: {
    /** Custom error code */
    code: string
    /** Any details content */
    details?: string
  }
}
