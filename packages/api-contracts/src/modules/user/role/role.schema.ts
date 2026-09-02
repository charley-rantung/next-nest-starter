import * as z from "zod"
import { BaseCustomSchema, BaseStringSchema } from "../../../common"

export const RoleCreateSchema = {
  body: z.object({
    name: z.string().trim().min(4).max(100),
    description: BaseStringSchema.nullable.optional(),
    permissions: z.array(BaseStringSchema.resourceId).max(100).optional(),
  }),
}

export const RoleListSchema = {
  query: BaseCustomSchema.paginationWithSearch,
}

export const RoleDetailSchema = {
  params: z.object({
    id: BaseStringSchema.resourceId,
  }),
}

export const RoleUpdateSchema = {
  params: RoleDetailSchema.params,
  body: RoleCreateSchema.body.partial(),
}

export const RoleDeleteSchema = {
  params: RoleDetailSchema.params,
}
