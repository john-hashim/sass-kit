import type { AxiosResponse } from 'axios'
import apiClient from '@/api'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse } from '@/types/api'
import type { Theme, User } from '@/types/auth'

export const authService = {
  getMe: (): Promise<AxiosResponse<ApiResponse<User>>> => apiClient.get(ENDPOINTS.AUTH.GET_ME),
  logout: (): Promise<AxiosResponse<ApiResponse>> => apiClient.post(ENDPOINTS.AUTH.LOGOUT),
  updateName: (name: string): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiClient.patch(ENDPOINTS.AUTH.UPDATE_NAME, { name }),
  updateTheme: (theme: Theme): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiClient.patch(ENDPOINTS.AUTH.UPDATE_THEME, { theme }),
  deleteAccount: (): Promise<AxiosResponse<ApiResponse>> =>
    apiClient.delete(ENDPOINTS.AUTH.DELETE_ACCOUNT),
}
