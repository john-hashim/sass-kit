import type { PrismaClient } from '@prisma/client'
import { json, Router } from 'express'
import { authController } from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import type { GoogleProvider } from '../services/google.service.js'
import { type ApiResponse, ApiStatus } from '../types/api.js'

export function authRoutes(db: PrismaClient, google: GoogleProvider) {
  const router = Router()
  const controller = authController(db, google)
  router.get('/google', controller.start)
  router.get('/google/callback', controller.callback)
  router.get('/me', requireAuth(db), (_req, res) =>
    res
      .status(200)
      .json({
        status: ApiStatus.SUCCESS,
        message: 'User retrieved successfully.',
        data: res.locals.user,
      } satisfies ApiResponse)
  )
  router.patch('/me', requireAuth(db), json({ limit: '8kb' }), controller.updateProfile)
  router.delete('/me', requireAuth(db), controller.deleteAccount)
  router.post('/logout', controller.logout)
  return router
}
