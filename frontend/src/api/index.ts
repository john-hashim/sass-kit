import type { ApiResponse } from '@/types/api'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
  }
}

export async function apiClient<T>(path: string, options?: RequestInit): Promise<T | null> {
  const response = await fetch(path, { ...options, credentials: 'include' })
  if (response.status === 204) return null
  const body: ApiResponse<T> = await response.json()
  if (!response.ok) throw new ApiError(response.status, body.error ?? 'Request failed.')
  if (body.data === undefined) throw new Error('Invalid API response.')
  return body.data
}
