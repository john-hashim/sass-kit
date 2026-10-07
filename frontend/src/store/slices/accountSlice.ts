import type { AxiosResponse } from 'axios'
import type { StateCreator } from 'zustand'
import { getApiErrorDetails } from '@/api/errors'
import { authService } from '@/api/services/auth'
import type { ApiResponse } from '@/types/api'
import type { Theme, User } from '@/types/auth'
import type { StoreState } from '../types'

export interface AccountSlice {
  profileSaving: boolean
  themeSaving: boolean
  accountDeleting: boolean
  profileError: string | null
  deleteError: string | null
  updateName: (name: string) => Promise<User | undefined>
  updateTheme: (theme: Theme) => Promise<User | undefined>
  deleteAccount: () => Promise<void>
  clearAccountErrors: () => void
}

export const createAccountSlice: StateCreator<StoreState, [], [], AccountSlice> = (set, get) => {
  const saveProfile = async (
    request: () => Promise<AxiosResponse<ApiResponse<User>>>,
    savingKey: 'profileSaving' | 'themeSaving'
  ) => {
    if (
      !get().user ||
      get().profileSaving ||
      get().themeSaving ||
      get().accountDeleting ||
      get().loggingOut
    )
      return
    const version = get().sessionVersion
    set({ [savingKey]: true, profileError: null })
    try {
      const response = await request()
      if (!response.data.data) throw new Error('Invalid profile response.')
      if (get().sessionVersion !== version) return
      set({ user: response.data.data })
      return response.data.data
    } catch (error) {
      if (get().sessionVersion === version) {
        const details = getApiErrorDetails(error, 'Unable to save your profile. Please try again.')
        if (details.kind === 'unauthorized') get().resetSession()
        else set({ profileError: details.message })
      }
      throw error
    } finally {
      if (get().sessionVersion === version) set({ [savingKey]: false })
    }
  }
  return {
    profileSaving: false,
    themeSaving: false,
    accountDeleting: false,
    profileError: null,
    deleteError: null,
    clearAccountErrors: () => set({ profileError: null, deleteError: null }),
    updateName: name => saveProfile(() => authService.updateName(name), 'profileSaving'),
    updateTheme: theme => saveProfile(() => authService.updateTheme(theme), 'themeSaving'),
    deleteAccount: async () => {
      if (
        !get().user ||
        get().accountDeleting ||
        get().profileSaving ||
        get().themeSaving ||
        get().loggingOut
      )
        return
      const version = get().sessionVersion
      set({ accountDeleting: true, deleteError: null })
      try {
        await authService.deleteAccount()
        if (get().sessionVersion === version) get().resetSession()
      } catch (error) {
        if (get().sessionVersion === version) {
          const details = getApiErrorDetails(
            error,
            'Unable to delete your account. Please try again.'
          )
          if (details.kind === 'unauthorized') get().resetSession()
          else set({ deleteError: details.message })
        }
        throw error
      } finally {
        if (get().sessionVersion === version) set({ accountDeleting: false })
      }
    },
  }
}
