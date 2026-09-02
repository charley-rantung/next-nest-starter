"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getRolesQueryOptions } from "@/api/main/user/role/query"
import { debounce } from "@/utils/helper"
import type { RoleListQuery } from "@starter-pack/api-contracts"

export function useRoleListController() {
  const [query, setQuery] = useState<RoleListQuery>({ page: 1, size: 10 })

  const roles = useQuery(getRolesQueryOptions(query))

  const handleSearch = debounce((val: string | undefined) => {
    setQuery((prev) => ({
      ...prev,
      search: val,
    }))
  })

  return {
    roles,
    query,
    setQuery,
    handleSearch,
  }
}
