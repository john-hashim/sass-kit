import axios from 'axios'

export type ApiErrorKind = 'cancelled' | 'network' | 'timeout' | 'unauthorized' | 'server' | 'local'

export interface ApiErrorDetails {
  kind: ApiErrorKind
  message: string
}

const getResponseMessage = (data: unknown): string | undefined => {
  if (!data || typeof data !== 'object') return undefined
  const body = data as { message?: unknown; error?: unknown }
  const message = body.error ?? body.message
  return typeof message === 'string' && message.trim() ? message : undefined
}

export const getApiErrorDetails = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
): ApiErrorDetails => {
  if (!axios.isAxiosError(error)) {
    return {
      kind: 'local',
      message: error instanceof Error ? error.message : fallback,
    }
  }

  if (axios.isCancel(error)) {
    return { kind: 'cancelled', message: '' }
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return {
      kind: 'timeout',
      message: 'The request timed out. Please try again.',
    }
  }

  if (!error.response) {
    return {
      kind: 'network',
      message: 'Network error. Please check your connection.',
    }
  }

  if (error.response.status === 401) {
    return {
      kind: 'unauthorized',
      message: 'Session expired. Please login again.',
    }
  }

  if (error.response.status >= 500) {
    return {
      kind: 'server',
      message: 'Server is unavailable. Please try again later.',
    }
  }

  return {
    kind: 'local',
    message: getResponseMessage(error.response.data) ?? fallback,
  }
}
