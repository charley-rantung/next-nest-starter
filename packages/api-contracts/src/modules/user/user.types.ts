import * as z from "zod"
import * as s from "./user.schema"
import { ApiResponse, PaginationMeta } from "../../common"

// Model
export type User = {
  uid: string
  name: string
  email: string
  username: string
  type: "user" | "admin" | "internal"
  is_active: boolean
  created_at: Date
  creator: {
    name: string
  }
  updated_at: Date
  updater: {
    name: string
  }
  roles: {
    id: number
    name: string
  }[]
  permissions: {
    id: number
    name: string
  }[]
}

export type Users = Array<{
  uid: string
  name: string
  email: string
  username: string
  is_active: boolean
  created_at: Date
  creator: {
    name: string
  }
  updated_at: Date
  updater: {
    name: string
  }
}>

// Create
export type UserCreateBody = z.input<typeof s.UserCreateSchema.body>
export type UserCreateResponse = ApiResponse<User>

// List
export type UserListQuery = z.input<typeof s.UserListSchema.query>
export type UserListResponse = ApiResponse<Users, PaginationMeta>

// Detail
export type UserDetailParams = z.input<typeof s.UserDetailSchema.params>
export type UserDetailResponse = ApiResponse<User | null>

// Update
export type UserUpdateParams = z.input<typeof s.UserUpdateSchema.params>
export type UserUpdateBody = z.input<typeof s.UserUpdateSchema.body>
export type UserUpdateResponse = ApiResponse<User>

// Update own password
export type UserUpdateOwnPasswordBody = z.input<typeof s.UserUpdateOwnPasswordSchema.body>
export type UserUpdateOwnPasswordResponse = ApiResponse
