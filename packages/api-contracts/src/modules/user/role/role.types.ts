import * as z from "zod"
import * as s from "./role.schema"
import { ApiResponse, PaginationMeta } from "../../../common"

// Model
export type Role = {
  id: number
  name: string
  description: string | null
  permissions: {
    id: number
    name: string
    description: string | null
  }[]
}

export type Roles = Array<{
  id: number
  name: string
  description: string | null
}>

// Create
export type RoleCreateBody = z.input<typeof s.RoleCreateSchema.body>
export type RoleCreateResponse = ApiResponse<Role>

// List
export type RoleListQuery = z.input<typeof s.RoleListSchema.query>
export type RoleListResponse = ApiResponse<Roles, PaginationMeta>

// Detail
export type RoleDetailParams = z.input<typeof s.RoleDetailSchema.params>
export type RoleDetailResponse = ApiResponse<Role | null>

// Update
export type RoleUpdateParams = z.input<typeof s.RoleUpdateSchema.params>
export type RoleUpdateBody = z.input<typeof s.RoleUpdateSchema.body>
export type RoleUpdateResponse = ApiResponse<Role>

// Delete
export type RoleDeleteParams = z.input<typeof s.RoleDeleteSchema.params>
export type RoleDeleteResponse = ApiResponse<Omit<Role, "permissions">>
