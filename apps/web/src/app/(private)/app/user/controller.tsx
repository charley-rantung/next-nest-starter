"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getUsersQueryOptions } from "@/api/main/user/query"
import { useFilterForm } from "./form"
import { debounce } from "@/utils/helper"
import type { UserListQuery } from "@starter-pack/api-contracts"

export function useUserListController() {
  const [query, setQuery] = useState<UserListQuery>({ page: 1, size: 10 })
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  const users = useQuery(getUsersQueryOptions(query))

  const filterForm = useFilterForm()
  const handleFilter = filterForm.handleSubmit((data) => {
    setQuery((prev) => ({
      ...prev,
      ...data,
      active: String(data.active),
    }))
    setIsFilterDrawerOpen(false)
  })

  const handleSearch = debounce((val: string | undefined) => {
    setQuery((prev) => ({
      ...prev,
      search: val,
    }))
  })

  return {
    users,
    query,
    setQuery,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    filterForm,
    handleSearch,
    handleFilter,
  }
}
