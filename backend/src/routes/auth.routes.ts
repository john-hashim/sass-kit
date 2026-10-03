import type { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { authController } from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import type { GoogleProvider } from '../services/google.service.js'

export function authRoutes(db: PrismaClient, google: GoogleProvider) {
  const router = Router()
  const controller = authController(db, google)
  router.get('/google', controller.start)
  router.get('/google/callback', controller.callback)
  router.get('/me', requireAuth(db), (_req, res) => res.json({ data: res.locals.user }))
  router.post('/logout', controller.logout)
  return router
}
