"use client"

import { useRouter } from "next/navigation"
import { PRIVATE_ROUTE_PREFIX } from "@/constant/public"

export function useSignInController() {
  const router = useRouter()

  const onSignInSuccess = () => {
    router.push(`${PRIVATE_ROUTE_PREFIX}/home`)
  }

  return { onSignInSuccess }
}
