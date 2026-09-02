import { api } from "@/api/main/axios"
import { generateSearchParams } from "@/api"
import type { PermissionListQuery, PermissionListResponse } from "@starter-pack/api-contracts"

const PATH = "/user-permissions/"

export const getPermissions = (props: { query?: PermissionListQuery }) => {
  const search = generateSearchParams(props.query)
  return api.get<PermissionListResponse>(PATH + search)
}
