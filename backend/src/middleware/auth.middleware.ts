import type { PrismaClient } from '@prisma/client'
import type { RequestHandler } from 'express'
import { currentUser, readCookie, SESSION_COOKIE } from '../services/session.service.js'
import { type ApiResponse, ApiStatus } from '../types/api.js'

export const requireAuth =
  (db: PrismaClient): RequestHandler =>
  async (req, res, next) => {
    const user = await currentUser(db, readCookie(req, SESSION_COOKIE))
    if (!user) {
      res
        .status(401)
        .json({ status: ApiStatus.FAILURE, message: 'Sign in to continue.' } satisfies ApiResponse)
      return
    }
    res.locals.user = user
    next()
  }
