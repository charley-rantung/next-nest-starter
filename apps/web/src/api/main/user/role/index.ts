import { api } from "@/api/main/axios"
import { generateSearchParams } from "@/api"
import type {
  RoleDeleteResponse,
  RoleCreateBody,
  RoleDeleteParams,
  RoleDetailParams,
  RoleListQuery,
  RoleUpdateBody,
  RoleUpdateParams,
  RoleCreateResponse,
  RoleListResponse,
  RoleDetailResponse,
  RoleUpdateResponse,
} from "@starter-pack/api-contracts"

const PATH = "/user-roles/"

export const createRole = (props: { body: RoleCreateBody }) => {
  return api.post<RoleCreateResponse>(PATH, props.body)
}

export const getRoles = (props: { query?: RoleListQuery }) => {
  const search = generateSearchParams(props.query)
  return api.get<RoleListResponse>(PATH + search)
}

export const getRole = (props: { params: RoleDetailParams }) => {
  return api.get<RoleDetailResponse>(PATH + props.params.id)
}

export const updateRole = (props: { params: RoleUpdateParams; body: RoleUpdateBody }) => {
  return api.patch<RoleUpdateResponse>(PATH + props.params.id, props.body)
}

export const deleteRole = (props: { params: RoleDeleteParams }) => {
  return api.delete<RoleDeleteResponse>(PATH + props.params.id)
}
