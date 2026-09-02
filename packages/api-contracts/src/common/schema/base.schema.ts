import * as z from "zod"

const MAX_INT32: number = 2147483647 // 2^31 -1

export const BaseStringSchema = {
  short: z.string().trim().max(100),
  numeric: z.string().trim().regex(/^\d+$/, "Must be a numeric string").max(100),
  /** Database resource reference that use unique string for its ID */
  resourceUid: z.string().trim().min(1).max(36),
  /** Database resource reference that use auto-increment for its ID */
  resourceId: z.coerce.number().int().positive().max(MAX_INT32),
  /** This schema will convert empty string or whitespace-only string to null */
  nullable: z
    .string()
    .trim()
    .max(255)
    .nullable()
    .overwrite((val) => (val === "" ? null : val)),
  /** Default username schema */
  username: z
    .string()
    .trim()
    .min(4)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  /** Default email schema */
  email: z.email().trim().toLowerCase().max(255),
  /** Default password schema */
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .refine((val) => /[A-Z]/.test(val), "At least one uppercase letter is required")
    .refine((val) => /[0-9]/.test(val), "At least one number is required"),
}

export const BaseDateSchema = {
  /** Default birthday schema */
  birthday: z.iso.date().refine((date) => new Date(date) < new Date(), {
    message: "Birthday must be in the past",
  }),
}

export const BaseCustomSchema = {
  /** Default pagination schema */
  pagination: z.object({
    /** Page Number */
    page: z.coerce.number<number>().int().positive().max(MAX_INT32).default(1),
    /** Page Size */
    size: z.coerce.number<number>().int().positive().max(100).default(10),
  }),

  /** Base pagination with search schema */
  paginationWithSearch: z.object({
    /** Page Number */
    page: z.coerce.number<number>().int().positive().max(MAX_INT32).default(1),
    /** Page Size */
    size: z.coerce.number<number>().int().positive().max(100).default(10),
    /** Query or Keywords */
    search: z.string().trim().max(100).optional(),
  }),
}
