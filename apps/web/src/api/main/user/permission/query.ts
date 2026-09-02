import * as x from "./"
import { queryOptions } from "@tanstack/react-query"
import type { PermissionListQuery } from "@starter-pack/api-contracts"

export const getPermissionsQueryOptions = (query?: PermissionListQuery) =>
  queryOptions({
    queryKey: ["user-permission:list"],
    queryFn: () => x.getPermissions({ query }),
  })
