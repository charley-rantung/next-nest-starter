import * as x from "./"
import { mutationOptions, queryOptions } from "@tanstack/react-query"
import type { RoleDetailParams, RoleListQuery } from "@starter-pack/api-contracts"

export const getRolesQueryOptions = (query?: RoleListQuery) =>
  queryOptions({
    queryKey: ["user-role:list", query],
    queryFn: () => x.getRoles({ query }),
  })

export const getRoleQueryOptions = (params: RoleDetailParams) =>
  queryOptions({
    queryKey: ["user-role:detail", params],
    queryFn: () => x.getRole({ params }),
    enabled: !!params.id,
  })

export const createRoleMutationOptions = () =>
  mutationOptions({
    mutationKey: ["user-role:create"],
    mutationFn: x.createRole,
  })

export const updateRoleMutationOptions = () =>
  mutationOptions({
    mutationKey: ["user-role:update"],
    mutationFn: x.updateRole,
  })

export const deleteRoleMutationOptions = () =>
  mutationOptions({
    mutationKey: ["user-role:delete"],
    mutationFn: x.deleteRole,
  })
