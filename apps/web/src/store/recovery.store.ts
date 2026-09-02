import { create } from "zustand"

type RecoveryState = {
  token: string | null
  setToken: (newToken: string | null) => void
}

export const useRecoveryStore = create<RecoveryState>((set) => ({
  token: null,
  setToken: (newToken) => set({ token: newToken }),
}))
