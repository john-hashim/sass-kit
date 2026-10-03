import type { ErrorRequestHandler } from 'express'

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error('Request failed:', error instanceof Error ? error.message : 'Unknown error')
  res.status(500).json({ error: 'Something went wrong. Please try again.' })
}
