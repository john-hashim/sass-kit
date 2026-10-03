import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { createRequire } from 'node:module'
import { after, beforeEach, test } from 'node:test'
import { PrismaClient } from '@prisma/client'
import request from 'supertest'
import { createApp } from '../app.js'
import { env } from '../config/env.js'
import type { GoogleProvider } from '../services/google.service.js'
import { hashToken } from '../services/session.service.js'

if (!process.env.TEST_DATABASE_URL) {
  throw new Error('Set TEST_DATABASE_URL to a local PostgreSQL database before running auth tests.')
}
const testUrl = new URL(process.env.TEST_DATABASE_URL)
if (!['postgres:', 'postgresql:'].includes(testUrl.protocol)) {
  throw new Error('TEST_DATABASE_URL must be a PostgreSQL URL.')
}
// Every run owns a random schema, so tests never clear application tables.
const schema = `redaction_test_${randomUUID().replaceAll('-', '')}`
testUrl.searchParams.set('schema', schema)
const databaseUrl = testUrl.toString()
execFileSync(
  process.execPath,
  [createRequire(import.meta.url).resolve('prisma/build/index.js'), 'migrate', 'deploy'],
  {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'pipe',
  }
)
const db = new PrismaClient({ datasources: { db: { url: databaseUrl } } })
let exchanges = 0
const google: GoogleProvider = {
  configured: true,
  authorizationUrl(state, nonce, challenge) {
    return `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({ state, nonce, code_challenge: challenge })}`
  },
  async authenticate(code, verifier, nonce) {
    exchanges++
    assert.equal(code, 'valid-code')
    assert.ok(verifier)
    assert.ok(nonce)
    return { googleId: 'google-user-1', email: 'test@example.com', name: 'Test User' }
  },
}
const app = createApp(db, google)

beforeEach(async () => {
  await db.session.deleteMany()
  await db.user.deleteMany()
  await db.oAuthAttempt.deleteMany()
  exchanges = 0
})
after(async () => {
  try {
    await db.$executeRawUnsafe(`DROP SCHEMA "${schema}" CASCADE`)
  } finally {
    await db.$disconnect()
  }
})

async function beginLogin() {
  const agent = request.agent(app)
  const start = await agent.get('/api/auth/google').expect(302)
  const url = new URL(start.headers.location)
  const state = url.searchParams.get('state')
  assert.ok(state)
  assert.ok(url.searchParams.get('code_challenge'))
  const callback = `/api/auth/google/callback?${new URLSearchParams({ state, code: 'valid-code' })}`
  return { agent, state, callback }
}

test('health checks the local database and private endpoint rejects anonymous users', async () => {
  await request(app).get('/health').expect(200)
  await request(app).get('/api/auth/me').expect(401)
})

test('OAuth creates a persistent user and hashed session; logout revokes access', async () => {
  const { agent, callback } = await beginLogin()
  const response = await agent.get(callback).expect(302)
  assert.equal(response.headers.location, `${env.frontendUrl}/dashboard`)
  assert.match(String(response.headers['set-cookie']), /HttpOnly/)
  const me = await agent.get('/api/auth/me').expect(200)
  assert.equal(me.body.data.email, 'test@example.com')
  assert.equal(await db.user.count(), 1)
  assert.equal(await db.session.count(), 1)
  const saved = await db.session.findFirstOrThrow()
  assert.match(saved.tokenHash, /^[a-f0-9]{64}$/)
  await agent.post('/api/auth/logout').set('Origin', 'https://attacker.example').expect(403)
  await agent.get('/api/auth/me').expect(200)
  await agent.post('/api/auth/logout').set('Origin', env.frontendUrl).expect(204)
  await agent.get('/api/auth/me').expect(401)
  assert.equal(await db.session.count(), 0)
})

test('rejects mismatched state, missing browser cookie, and callback replay', async () => {
  const { agent, callback } = await beginLogin()
  await request(app).get(callback).expect(302)
  assert.equal(exchanges, 0)
  await agent.get(callback).expect(302)
  assert.equal(exchanges, 1)
  await agent.get(callback).expect(302)
  assert.equal(exchanges, 1)
  const next = await beginLogin()
  const result = await next.agent
    .get('/api/auth/google/callback?state=wrong&code=valid-code')
    .expect(302)
  assert.equal(result.headers.location, `${env.frontendUrl}/login?error=auth_failed`)
  assert.equal(exchanges, 1)
})

test('expired OAuth attempts and failed token verification never establish a session', async () => {
  const { agent, state, callback } = await beginLogin()
  await db.oAuthAttempt.update({
    where: { stateHash: hashToken(state) },
    data: { expiresAt: new Date(0) },
  })
  await agent.get(callback).expect(302)
  assert.equal(exchanges, 0)
  const failedApp = createApp(db, {
    ...google,
    authenticate: async () => {
      throw new Error('Invalid ID token')
    },
  })
  const failedAgent = request.agent(failedApp)
  const start = await failedAgent.get('/api/auth/google').expect(302)
  const failedState = new URL(start.headers.location).searchParams.get('state')
  await failedAgent.get(`/api/auth/google/callback?state=${failedState}&code=bad`).expect(302)
  await failedAgent.get('/api/auth/me').expect(401)
  assert.equal(await db.session.count(), 0)
})

test('repeat Google login updates the same user and expired sessions lose access', async () => {
  const first = await beginLogin()
  await first.agent.get(first.callback).expect(302)
  const second = await beginLogin()
  await second.agent.get(second.callback).expect(302)
  assert.equal(await db.user.count(), 1)
  await db.session.updateMany({ data: { expiresAt: new Date(0) } })
  await first.agent.get('/api/auth/me').expect(401)
  await second.agent.get('/api/auth/me').expect(401)
})

test('missing Google configuration returns a useful login error', async () => {
  const response = await request(createApp(db, { ...google, configured: false }))
    .get('/api/auth/google')
    .expect(302)
  assert.equal(response.headers.location, `${env.frontendUrl}/login?error=not_configured`)
})
