import { api } from "@/api/main/axios"
import { generateSearchParams } from "@/api"
import type {
  UserDetailParams,
  UserListQuery,
  UserUpdateBody,
  UserUpdateOwnPasswordBody,
  UserUpdateParams,
  UserCreateBody,
  UserCreateResponse,
  UserListResponse,
  UserDetailResponse,
  UserUpdateResponse,
  UserUpdateOwnPasswordResponse,
} from "@starter-pack/api-contracts"

const PATH = "/users/"

export const createUser = (props: { body: UserCreateBody }) => {
  return api.post<UserCreateResponse>(PATH, props.body)
}

export const getUsers = (props: { query?: UserListQuery }) => {
  const search = generateSearchParams(props.query)
  return api.get<UserListResponse>(PATH + search)
}

export const getUser = (props: { params: UserDetailParams }) => {
  return api.get<UserDetailResponse>(PATH + props.params.uid)
}

export const getMe = () => {
  return api.get<UserDetailResponse>(PATH + "me")
}

export const updateUser = (props: { params: UserUpdateParams; body: UserUpdateBody }) => {
  return api.patch<UserUpdateResponse>(PATH + props.params.uid, props.body)
}

export const updateMyPassword = (props: { body: UserUpdateOwnPasswordBody }) => {
  return api.patch<UserUpdateOwnPasswordResponse>(PATH + "me/password", props.body)
}
