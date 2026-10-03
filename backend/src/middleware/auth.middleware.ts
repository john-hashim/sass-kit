import type { PrismaClient } from '@prisma/client'
import type { RequestHandler } from 'express'
import { currentUser, readCookie, SESSION_COOKIE } from '../services/session.service.js'

export const requireAuth =
  (db: PrismaClient): RequestHandler =>
  async (req, res, next) => {
    const user = await currentUser(db, readCookie(req, SESSION_COOKIE))
    if (!user) {
      res.status(401).json({ error: 'Sign in to continue.' })
      return
    }
    res.locals.user = user
    next()
  }
