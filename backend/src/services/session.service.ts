import { createHash, randomBytes } from 'node:crypto'
import type { PrismaClient } from '@prisma/client'
import { parse } from 'cookie'
import type { Request } from 'express'
import { env } from '../config/env.js'

export const SESSION_COOKIE = 'redaction_session'
export const STATE_COOKIE = 'google_state'
export const sessionLifetime = 7 * 24 * 60 * 60 * 1000
export const cookieOptions = { httpOnly: true, secure: env.secureCookies, sameSite: 'lax' as const }
export const randomToken = () => randomBytes(32).toString('base64url')
export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')
export const readCookie = (req: Request, name: string) => parse(req.headers.cookie ?? '')[name]

export async function currentUser(db: PrismaClient, token: string | undefined) {
  if (!token) return null
  const session = await db.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  })
  if (!session || session.expiresAt <= new Date()) return null
  const { id, email, name, theme } = session.user
  return { id, email, name, theme }
}
