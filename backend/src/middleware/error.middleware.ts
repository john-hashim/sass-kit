import type { ErrorRequestHandler } from 'express'
import { type ApiResponse, ApiStatus } from '../types/api.js'

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error('Request failed:', error instanceof Error ? error.message : 'Unknown error')
  res
    .status(500)
    .json({
      status: ApiStatus.FAILURE,
      message: 'Something went wrong. Please try again.',
    } satisfies ApiResponse)
}
