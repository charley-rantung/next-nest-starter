"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserListSchema } from "@starter-pack/api-contracts"

export const useFilterForm = () =>
  useForm({
    resolver: zodResolver(UserListSchema.query),
  })
