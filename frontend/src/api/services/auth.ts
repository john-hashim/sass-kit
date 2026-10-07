import type { AxiosResponse } from 'axios'
import apiClient from '@/api'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse } from '@/types/api'
import type { User } from '@/types/auth'

export const authService = {
  getMe: (): Promise<AxiosResponse<ApiResponse<User>>> => apiClient.get(ENDPOINTS.AUTH.GET_ME),
  logout: (): Promise<AxiosResponse<void>> => apiClient.post(ENDPOINTS.AUTH.LOGOUT),
  updateName: (name: string): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiClient.patch(ENDPOINTS.AUTH.UPDATE_NAME, { name }),
  deleteAccount: (): Promise<AxiosResponse<void>> =>
    apiClient.delete(ENDPOINTS.AUTH.DELETE_ACCOUNT),
}
