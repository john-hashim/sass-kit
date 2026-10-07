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

describe('userSlice', () => {
  it('deduplicates startup requests and restores the server user', async () => {
    const store = makeStore()
    vi.mocked(authService.getMe).mockResolvedValue(response(user))
    await Promise.all([store.getState().refresh(), store.getState().refresh()])
    expect(authService.getMe).toHaveBeenCalledTimes(1)
    expect(store.getState()).toMatchObject({ user, initialized: true, loading: false, error: null })
  })

  it('treats an anonymous startup as a completed session check', async () => {
    const store = makeStore()
    vi.mocked(authService.getMe).mockRejectedValue(unauthorized())
    await store.getState().refresh()
    expect(store.getState()).toMatchObject({
      user: null,
      initialized: true,
      error: null,
      loading: false,
    })
  })

  it('exposes a startup failure and allows retry', async () => {
    const store = makeStore()
    vi.mocked(authService.getMe)
      .mockRejectedValueOnce(new AxiosError('offline', 'ERR_NETWORK'))
      .mockResolvedValueOnce(response(user))
    await store.getState().refresh()
    expect(store.getState().error).toContain('Network error')
    await store.getState().refresh()
    expect(store.getState()).toMatchObject({ user, error: null, loading: false })
  })

  it('preserves the user on failed sign-out and clears it on retry', async () => {
    const store = makeStore()
    store.setState({ user })
    vi.mocked(authService.logout)
      .mockRejectedValueOnce(new AxiosError('offline', 'ERR_NETWORK'))
      .mockResolvedValueOnce({ status: 204 } as AxiosResponse<void>)
    await expect(store.getState().logout()).rejects.toThrow()
    expect(store.getState().user).toEqual(user)
    expect(store.getState().loggingOut).toBe(false)
    expect(store.getState().logoutError).toContain('Network error')
    await store.getState().logout()
    expect(store.getState()).toMatchObject({ user: null, logoutError: null })
  })

  it('does not restore a user from a session check after the session is cleared', async () => {
    const store = makeStore()
    let finish: (value: AxiosResponse<ApiResponse<User>>) => void = () => {}
    vi.mocked(authService.getMe).mockReturnValue(
      new Promise(resolve => {
        finish = resolve
      })
    )
    const pending = store.getState().refresh()
    store.getState().resetSession()
    finish(response(user))
    await pending
    expect(store.getState()).toMatchObject({ user: null, initialized: true, loading: false })
  })
})
