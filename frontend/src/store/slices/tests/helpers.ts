import { AxiosError, type AxiosResponse } from 'axios'
import { createStore } from 'zustand/vanilla'
import { createAccountSlice, createUserSlice } from '@/store/slices'
import type { StoreState } from '@/store/types'
import type { ApiResponse } from '@/types/api'
import type { User } from '@/types/auth'

export const user: User = { id: 'user-1', name: 'Test User', email: 'test@example.com' }
export const response = (data: User) => ({ data: { data } }) as AxiosResponse<ApiResponse<User>>
export const unauthorized = () =>
  new AxiosError('Unauthorized', undefined, undefined, undefined, { status: 401 } as AxiosResponse)
export const makeStore = () =>
  createStore<StoreState>()((...a) => ({
    ...createUserSlice(...a),
    ...createAccountSlice(...a),
  }))
