import { AxiosError, type AxiosResponse } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authService } from '@/api/services/auth'
import type { ApiResponse } from '@/types/api'
import type { User } from '@/types/auth'
import { makeStore, response, unauthorized, user } from './helpers'

vi.mock('@/api/services/auth', () => ({
  authService: {
    getMe: vi.fn(),
    logout: vi.fn(),
    updateName: vi.fn(),
    updateTheme: vi.fn(),
    deleteAccount: vi.fn(),
  },
}))

beforeEach(() => vi.resetAllMocks())

describe('accountSlice', () => {
  it('updates the shared profile and deduplicates saving', async () => {
    const store = makeStore()
    store.setState({ user })
    const updated = { ...user, name: 'Updated User' }
    vi.mocked(authService.updateName).mockResolvedValue(response(updated))
    await Promise.all([
      store.getState().updateName(updated.name),
      store.getState().updateName(updated.name),
    ])
    expect(authService.updateName).toHaveBeenCalledTimes(1)
    expect(store.getState()).toMatchObject({
      user: updated,
      profileSaving: false,
      profileError: null,
    })
  })

  it('persists theme in the shared user and restores it on refresh', async () => {
    const store = makeStore()
    store.setState({ user })
    const updated: User = { ...user, theme: 'light' }
    vi.mocked(authService.updateTheme).mockResolvedValue(response(updated))
    await store.getState().updateTheme('light')
    expect(authService.updateTheme).toHaveBeenCalledWith('light')
    expect(store.getState().user?.theme).toBe('light')
    store.getState().resetSession()
    vi.mocked(authService.getMe).mockResolvedValue(response(updated))
    await store.getState().refresh()
    expect(store.getState().user?.theme).toBe('light')
  })

  it('tracks theme loading separately and blocks conflicting account changes', async () => {
    const store = makeStore()
    store.setState({ user })
    let finish: (value: AxiosResponse<ApiResponse<User>>) => void = () => {}
    vi.mocked(authService.updateTheme).mockReturnValue(
      new Promise(resolve => {
        finish = resolve
      })
    )
    const pending = store.getState().updateTheme('light')
    expect(store.getState()).toMatchObject({ themeSaving: true, profileSaving: false })
    await store.getState().updateName('Updated')
    await store.getState().updateTheme('system')
    await store.getState().deleteAccount()
    expect(authService.updateName).not.toHaveBeenCalled()
    expect(authService.updateTheme).toHaveBeenCalledTimes(1)
    expect(authService.deleteAccount).not.toHaveBeenCalled()
    finish(response({ ...user, theme: 'light' }))
    await pending
    expect(store.getState()).toMatchObject({ themeSaving: false, profileSaving: false })
  })

  it('preserves the saved theme if a theme request fails', async () => {
    const store = makeStore()
    store.setState({ user })
    vi.mocked(authService.updateTheme).mockRejectedValue(new AxiosError('offline', 'ERR_NETWORK'))
    await expect(store.getState().updateTheme('system')).rejects.toThrow()
    expect(store.getState().user?.theme).toBe('dark')
    expect(store.getState().profileSaving).toBe(false)
    expect(store.getState().themeSaving).toBe(false)
    expect(store.getState().profileError).toContain('Network error')
  })

  it('does not restore a user when a theme response arrives after logout', async () => {
    const store = makeStore()
    store.setState({ user })
    let finish: (value: AxiosResponse<ApiResponse<User>>) => void = () => {}
    vi.mocked(authService.updateTheme).mockReturnValue(
      new Promise(resolve => {
        finish = resolve
      })
    )
    const pending = store.getState().updateTheme('system')
    store.getState().resetSession()
    expect(store.getState().themeSaving).toBe(false)
    finish(response({ ...user, theme: 'system' }))
    await pending
    expect(store.getState().user).toBeNull()
  })

  it('preserves the profile when saving fails and exposes backend validation', async () => {
    const store = makeStore()
    store.setState({ user })
    vi.mocked(authService.updateName).mockRejectedValue(
      new AxiosError('invalid', undefined, undefined, undefined, {
        status: 400,
        data: { error: 'Name is required.' },
      } as AxiosResponse)
    )
    await expect(store.getState().updateName('')).rejects.toThrow()
    expect(store.getState()).toMatchObject({
      user,
      profileSaving: false,
      profileError: 'Name is required.',
    })
  })

  it('clears an expired session during an account request', async () => {
    const store = makeStore()
    store.setState({ user })
    vi.mocked(authService.updateName).mockRejectedValue(unauthorized())
    await expect(store.getState().updateName('Updated')).rejects.toThrow()
    expect(store.getState()).toMatchObject({ user: null, profileSaving: false, profileError: null })
  })

  it('does not resurrect a signed-out user when a profile response arrives late', async () => {
    const store = makeStore()
    store.setState({ user })
    let finish: (value: AxiosResponse<ApiResponse<User>>) => void = () => {}
    vi.mocked(authService.updateName).mockReturnValue(
      new Promise(resolve => {
        finish = resolve
      })
    )
    const pending = store.getState().updateName('Late User')
    vi.mocked(authService.logout).mockResolvedValue({ status: 204 } as AxiosResponse<void>)
    await store.getState().logout()
    finish(response({ ...user, name: 'Late User' }))
    await pending
    expect(store.getState()).toMatchObject({ user: null, profileSaving: false })
  })

  it('keeps the session on failed deletion and resets all account state on success', async () => {
    const store = makeStore()
    store.setState({ user })
    vi.mocked(authService.deleteAccount)
      .mockRejectedValueOnce(new AxiosError('offline', 'ERR_NETWORK'))
      .mockResolvedValueOnce({ status: 204 } as AxiosResponse<void>)
    await expect(store.getState().deleteAccount()).rejects.toThrow()
    expect(store.getState()).toMatchObject({ user, accountDeleting: false })
    expect(store.getState().deleteError).toContain('Network error')
    await store.getState().deleteAccount()
    expect(store.getState()).toMatchObject({
      user: null,
      accountDeleting: false,
      deleteError: null,
    })
  })
})
