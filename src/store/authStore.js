import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      setAuth: (user, token) => set({ user, token }),

      logout: () => set({ user: null, token: null }),

      isLoggedIn: () => {
        const state = useAuthStore.getState()
        return !!state.token
      },
    }),
    {
      name: 'aquashop-auth',
    }
  )
)

export default useAuthStore