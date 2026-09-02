import { create } from "zustand"
import type { AccessTokenPayload } from "@starter-pack/api-contracts"

type UserState = {
  user: AccessTokenPayload["user"] | null
  setUser: (newUser: AccessTokenPayload["user"] | null) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (newUser) => set({ user: newUser }),
}))
