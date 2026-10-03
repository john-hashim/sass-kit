import type { PrismaClient } from '@prisma/client'
import express from 'express'
import { errorHandler } from './middleware/error.middleware.js'
import { authRoutes } from './routes/auth.routes.js'
import type { GoogleProvider } from './services/google.service.js'

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
    res.json({ data: { status: 'ok' } })
  })
  app.use('/api/auth', authRoutes(db, google))
  app.use((_req, res) => res.status(404).json({ error: 'Not found.' }))
  app.use(errorHandler)
  return app
}
