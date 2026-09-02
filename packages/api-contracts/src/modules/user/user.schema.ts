import * as z from "zod"
import { BaseCustomSchema, BaseStringSchema } from "../../common"

export const UserCreateSchema = {
  body: z.object({
    name: z.string().trim().min(4).max(100),
    email: BaseStringSchema.email,
    username: BaseStringSchema.username,
    password: BaseStringSchema.password,
    type: z.enum(["user", "admin"]),
    is_active: z.boolean().optional(),
    roles: z.array(BaseStringSchema.resourceId).max(100).optional(),
    permissions: z.array(BaseStringSchema.resourceId).max(100).optional(),
  }),
}

export const UserListSchema = {
  query: BaseCustomSchema.paginationWithSearch.extend(
    z
      .object({
        type: z.enum(["user", "admin"]),
        active: z.stringbool(),
      })
      .partial().shape,
  ),
}

export const UserDetailSchema = {
  params: z.object({
    uid: BaseStringSchema.resourceUid,
  }),
}

export const UserUpdateSchema = {
  params: UserDetailSchema.params,
  body: UserCreateSchema.body
    .omit({
      password: true,
    })
    .partial(),
}

export const UserUpdateOwnPasswordSchema = {
  body: z.object({
    old_password: BaseStringSchema.password,
    new_password: BaseStringSchema.password,
  }),
}
