import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import { createAccountSlice, createUserSlice } from './slices'
import type { StoreState } from './types'

// Session cookies remain owned by the backend; restore the user with refresh on startup.
export const useStore = create<StoreState>()(
  devtools((...a) => ({ ...createUserSlice(...a), ...createAccountSlice(...a) }), {
    name: 'AppStore',
    enabled: import.meta.env.DEV,
  })
)

export const useUserStore = () =>
  useStore(
    useShallow(state => ({
      user: state.user,
      initialized: state.initialized,
      loading: state.loading,
      error: state.error,
      loggingOut: state.loggingOut,
      logoutError: state.logoutError,
      refresh: state.refresh,
      logout: state.logout,
    }))
  )

export const useAccountStore = () =>
  useStore(
    useShallow(state => ({
      profileSaving: state.profileSaving,
      accountDeleting: state.accountDeleting,
      profileError: state.profileError,
      deleteError: state.deleteError,
      updateName: state.updateName,
      updateTheme: state.updateTheme,
      deleteAccount: state.deleteAccount,
      clearAccountErrors: state.clearAccountErrors,
    }))
  )
