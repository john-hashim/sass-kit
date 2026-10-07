import { type ApiResponse, ApiStatus } from '@/types/api'
import type { User } from '@/types/auth'

export function requireApiSuccess<T>(body: ApiResponse<T>): ApiResponse<T> {
  if (!body || typeof body.message !== 'string' || !body.message.trim()) {
    throw new Error('Invalid API response.')
  }
  if (body.status === ApiStatus.FAILURE) throw new Error(body.message)
  if (body.status !== ApiStatus.SUCCESS) throw new Error('Invalid API response.')
  return body
}

export function requireUserData(body: ApiResponse<User>): User {
  const { data } = requireApiSuccess(body)
  if (
    !data ||
    typeof data.id !== 'string' ||
    typeof data.name !== 'string' ||
    typeof data.email !== 'string' ||
    !['light', 'dark', 'system'].includes(data.theme)
  ) {
    throw new Error('Invalid profile response.')
  }
  return data
}
