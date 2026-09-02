import * as x from "."
import { mutationOptions, queryOptions } from "@tanstack/react-query"
import type { UserDetailParams, UserListQuery } from "@starter-pack/api-contracts"

export const getUsersQueryOptions = (query?: UserListQuery) =>
  queryOptions({
    queryKey: ["user:list", query],
    queryFn: () => x.getUsers({ query }),
  })

export const getUserQueryOptions = (params: UserDetailParams) =>
  queryOptions({
    queryKey: ["user:detail", params],
    queryFn: () => x.getUser({ params }),
    enabled: !!params.uid,
  })

export const getMeQueryOptions = () =>
  queryOptions({
    queryKey: ["user:me"],
    queryFn: () => x.getMe(),
  })

export const createUserMutationOptions = () =>
  mutationOptions({
    mutationKey: ["user:create"],
    mutationFn: x.createUser,
  })

export const updateUserMutationOptions = () =>
  mutationOptions({
    mutationKey: ["user:update"],
    mutationFn: x.updateUser,
  })

export const updateMyPasswordMutationOptions = () =>
  mutationOptions({
    mutationKey: ["user:update-my-password"],
    mutationFn: x.updateMyPassword,
  })
