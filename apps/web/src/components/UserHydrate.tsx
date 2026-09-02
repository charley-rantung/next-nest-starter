"use client"

import { useEffect } from "react"
import { useUserStore } from "@/store/user.store"
import type { AccessTokenPayload } from "@starter-pack/api-contracts"

type UserHydrateProps = {
  user: AccessTokenPayload["user"] | null
}

export default function UserHydrate(props: UserHydrateProps) {
  const setUser = useUserStore((s) => s.setUser)

  useEffect(() => {
    setUser(props.user)
  }, [props.user, setUser])

  return null
}
