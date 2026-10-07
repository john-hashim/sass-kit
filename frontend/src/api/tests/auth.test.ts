import type { AxiosAdapter } from 'axios'
import { expect, it } from 'vitest'
import apiClient from '@/api'
import { authService } from '@/api/services/auth'

it('uses the shared credentialed client for all authentication and account endpoints', async () => {
  const requests: { method?: string; url?: string; data: unknown; credentials?: boolean }[] = []
  const originalAdapter = apiClient.defaults.adapter
  const adapter: AxiosAdapter = async config => {
    requests.push({
      method: config.method,
      url: config.url,
      data: config.data,
      credentials: config.withCredentials,
    })
    return {
      data: {},
      status: config.method === 'get' ? 200 : 204,
      statusText: 'OK',
      headers: {},
      config,
    }
  }
  apiClient.defaults.adapter = adapter
  try {
    await authService.getMe()
    await authService.updateName('New Name')
    await authService.updateTheme('system')
    await authService.logout()
    await authService.deleteAccount()
    expect(requests.map(request => [request.method, request.url])).toEqual([
      ['get', '/api/auth/me'],
      ['patch', '/api/auth/me'],
      ['patch', '/api/auth/me'],
      ['post', '/api/auth/logout'],
      ['delete', '/api/auth/me'],
    ])
    expect(requests.every(request => request.credentials)).toBe(true)
    expect(requests[1]?.data).toBe(JSON.stringify({ name: 'New Name' }))
    expect(requests[2]?.data).toBe(JSON.stringify({ theme: 'system' }))
    expect(apiClient.defaults.timeout).toBe(10000)
  } finally {
    apiClient.defaults.adapter = originalAdapter
  }
})
