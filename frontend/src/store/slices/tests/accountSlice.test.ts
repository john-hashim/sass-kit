import { AxiosError, type AxiosResponse } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authService } from '@/api/services/auth'
import type { ApiResponse } from '@/types/api'
import type { User } from '@/types/auth'
import { makeStore, response, unauthorized, user } from './helpers'

vi.mock('@/api/services/auth', () => ({
  authService: { getMe: vi.fn(), logout: vi.fn(), updateName: vi.fn(), deleteAccount: vi.fn() },
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
