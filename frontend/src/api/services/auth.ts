import { ApiError, apiClient } from '@/api'
import { ENDPOINTS } from '@/api/endpoints'
import type { User } from '@/types/auth'

export async function getCurrentUser(): Promise<User | null> {
  try {
    return await apiClient<User>(ENDPOINTS.auth.me)
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null
    throw error
  }
}
export const signOut = () => apiClient(ENDPOINTS.auth.logout, { method: 'POST' })
