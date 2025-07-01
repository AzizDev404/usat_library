import { create } from "zustand"

interface AuthState {
  userId: string | null
  setUserId: (id: string) => void
  clearUserId: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: typeof window !== "undefined" ? localStorage.getItem("userId") : null,
  setUserId: (id) => {
    localStorage.setItem("userId", id)
    set({ userId: id })
  },
  clearUserId: () => {
    localStorage.removeItem("userId")
    set({ userId: null })
  },
}))
