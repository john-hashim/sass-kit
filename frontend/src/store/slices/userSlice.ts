import type { StateCreator } from 'zustand'
import { getApiErrorDetails } from '@/api/errors'
import { authService } from '@/api/services/auth'
import type { User } from '@/types/auth'
import type { StoreState } from '../types'

export interface UserSlice {
  user: User | null
  initialized: boolean
  loading: boolean
  error: string | null
  loggingOut: boolean
  logoutError: string | null
  sessionVersion: number
  refresh: () => Promise<void>
  logout: () => Promise<void>
  resetSession: () => void
}

export const createUserSlice: StateCreator<StoreState, [], [], UserSlice> = (set, get) => ({
  user: null,
  initialized: false,
  loading: false,
  error: null,
  loggingOut: false,
  logoutError: null,
  sessionVersion: 0,
  refresh: async () => {
    if (get().loading) return
    const version = get().sessionVersion
    set({ loading: true, error: null })
    try {
      const response = await authService.getMe()
      if (!response.data.data) throw new Error('Invalid profile response.')
      if (get().sessionVersion === version) set({ user: response.data.data })
    } catch (error) {
      if (get().sessionVersion !== version) return
      const details = getApiErrorDetails(error)
      if (details.kind === 'unauthorized') get().resetSession()
      else set({ error: details.message })
    } finally {
      if (get().sessionVersion === version) set({ loading: false, initialized: true })
    }
  },
  logout: async () => {
    if (get().loggingOut) return
    set({ loggingOut: true, logoutError: null })
    try {
      await authService.logout()
      get().resetSession()
    } catch (error) {
      const details = getApiErrorDetails(error, 'Unable to sign out. Please try again.')
      if (details.kind === 'unauthorized') get().resetSession()
      else {
        set({ logoutError: details.message })
        throw error
      }
    } finally {
      set({ loggingOut: false })
    }
  },
  resetSession: () =>
    set(state => ({
      user: null,
      initialized: true,
      loading: false,
      error: null,
      loggingOut: false,
      logoutError: null,
      profileSaving: false,
      themeSaving: false,
      accountDeleting: false,
      profileError: null,
      deleteError: null,
      sessionVersion: state.sessionVersion + 1,
    })),
})
