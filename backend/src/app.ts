import type { PrismaClient } from '@prisma/client'
import express from 'express'
import { errorHandler } from './middleware/error.middleware.js'
import { authRoutes } from './routes/auth.routes.js'
import type { GoogleProvider } from './services/google.service.js'
import { type ApiResponse, ApiStatus } from './types/api.js'

export function createApp(db: PrismaClient, google: GoogleProvider) {
  const app = express()
  app.disable('x-powered-by')
  app.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    next()
  })
  app.get('/health', async (_req, res) => {
    await db.$queryRaw`SELECT 1`
    res
      .status(200)
      .json({
        status: ApiStatus.SUCCESS,
        message: 'Server is healthy.',
        data: { status: 'ok' },
      } satisfies ApiResponse)
  })
  app.use('/api/auth', authRoutes(db, google))
  app.use((_req, res) =>
    res.status(404).json({ status: ApiStatus.FAILURE, message: 'Not found.' } satisfies ApiResponse)
  )
  app.use(errorHandler)
  return app
}
