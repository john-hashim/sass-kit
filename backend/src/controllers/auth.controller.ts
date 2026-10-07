import { createHash } from 'node:crypto'
import type { PrismaClient } from '@prisma/client'
import type { RequestHandler } from 'express'
import { env } from '../config/env.js'
import type { GoogleProvider } from '../services/google.service.js'
import {
  cookieOptions,
  hashToken,
  randomToken,
  readCookie,
  SESSION_COOKIE,
  STATE_COOKIE,
  sessionLifetime,
} from '../services/session.service.js'

export function authController(db: PrismaClient, google: GoogleProvider) {
  const start: RequestHandler = async (_req, res) => {
    if (!google.configured) {
      res.redirect(`${env.frontendUrl}/login?error=not_configured`)
      return
    }
    const state = randomToken()
    const nonce = randomToken()
    const verifier = randomToken()
    const now = new Date()
    await db.$transaction([
      db.oAuthAttempt.deleteMany({ where: { expiresAt: { lte: now } } }),
      db.session.deleteMany({ where: { expiresAt: { lte: now } } }),
      db.oAuthAttempt.create({
        data: {
          stateHash: hashToken(state),
          nonce,
          verifier,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      }),
    ])
    res.cookie(STATE_COOKIE, state, {
      ...cookieOptions,
      path: '/api/auth/google',
      maxAge: 10 * 60 * 1000,
    })
    const challenge = createHash('sha256').update(verifier).digest('base64url')
    res.redirect(google.authorizationUrl(state, nonce, challenge))
  }

  const callback: RequestHandler = async (req, res) => {
    const { state, code } = req.query
    const cookieState = readCookie(req, STATE_COOKIE)
    res.clearCookie(STATE_COOKIE, { ...cookieOptions, path: '/api/auth/google' })
    const fail = () => res.redirect(`${env.frontendUrl}/login?error=auth_failed`)
    if (typeof state !== 'string' || !cookieState || state !== cookieState) {
      fail()
      return
    }
    const stateHash = hashToken(state)
    const attempt = await db.oAuthAttempt.findUnique({ where: { stateHash } })
    const consumed = await db.oAuthAttempt.deleteMany({ where: { stateHash } })
    if (
      !attempt ||
      consumed.count !== 1 ||
      attempt.expiresAt <= new Date() ||
      typeof code !== 'string' ||
      req.query.error
    ) {
      fail()
      return
    }
    try {
      const identity = await google.authenticate(code, attempt.verifier, attempt.nonce)
      const token = randomToken()
      const oldToken = readCookie(req, SESSION_COOKIE)
      await db.$transaction(async tx => {
        const user = await tx.user.upsert({
          where: { googleId: identity.googleId },
          create: identity,
          update: { email: identity.email },
        })
        if (oldToken) await tx.session.deleteMany({ where: { tokenHash: hashToken(oldToken) } })
        await tx.session.create({
          data: {
            tokenHash: hashToken(token),
            userId: user.id,
            expiresAt: new Date(Date.now() + sessionLifetime),
          },
        })
      })
      res.cookie(SESSION_COOKIE, token, { ...cookieOptions, path: '/', maxAge: sessionLifetime })
      res.redirect(`${env.frontendUrl}/dashboard`)
    } catch {
      fail()
    }
  }

  const logout: RequestHandler = async (req, res) => {
    // Only our frontend may submit this cookie-authenticated mutation.
    if (req.headers.origin !== env.frontendUrl) {
      res.status(403).json({ error: 'Invalid request origin.' })
      return
    }
    const token = readCookie(req, SESSION_COOKIE)
    if (token) await db.session.deleteMany({ where: { tokenHash: hashToken(token) } })
    res.clearCookie(SESSION_COOKIE, { ...cookieOptions, path: '/' })
    res.status(204).end()
  }
  const updateProfile: RequestHandler = async (req, res) => {
    if (req.headers.origin !== env.frontendUrl) {
      res.status(403).json({ error: 'Invalid request origin.' })
      return
    }
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
    if (!name || name.length > 100) {
      res.status(400).json({ error: 'Enter a name between 1 and 100 characters.' })
      return
    }
    const user = await db.user.update({
      where: { id: res.locals.user.id },
      data: { name },
      select: { id: true, name: true, email: true },
    })
    res.json({ data: user })
  }
  const deleteAccount: RequestHandler = async (req, res) => {
    if (req.headers.origin !== env.frontendUrl) {
      res.status(403).json({ error: 'Invalid request origin.' })
      return
    }
    await db.user.delete({ where: { id: res.locals.user.id } })
    res.clearCookie(SESSION_COOKIE, { ...cookieOptions, path: '/' })
    res.status(204).end()
  }
  return { start, callback, logout, updateProfile, deleteAccount }
}
