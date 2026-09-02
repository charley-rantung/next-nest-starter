"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getMeQueryOptions } from "@/api/main/user/query"
import { getOwnSessionsQueryOptions } from "@/api/main/user/auth/query"

export function useAccountController() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const user = useQuery(getMeQueryOptions())
  const sessions = useQuery(getOwnSessionsQueryOptions())

  return { isModalOpen, setIsModalOpen, user, sessions }
}
