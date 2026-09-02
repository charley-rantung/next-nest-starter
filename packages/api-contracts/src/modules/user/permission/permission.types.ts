import * as z from "zod"
import * as s from "./permission.schema"
import { ApiResponse, PaginationMeta } from "../../../common"

// Model
export type Permission = undefined

export type Permissions = Array<{
  id: number
  slug: string
  name: string
  description: string | null
}>

// List
export type PermissionListQuery = z.input<typeof s.PermissionListSchema.query>
export type PermissionListResponse = ApiResponse<Permissions, PaginationMeta>
