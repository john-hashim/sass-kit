import { CodeChallengeMethod, OAuth2Client } from 'google-auth-library'
import { env } from '../config/env.js'

export interface GoogleIdentity {
  googleId: string
  email: string
  name: string
}

export interface GoogleProvider {
  configured: boolean
  authorizationUrl(state: string, nonce: string, challenge: string): string
  authenticate(code: string, verifier: string, nonce: string): Promise<GoogleIdentity>
}

const client = new OAuth2Client(env.googleClientId, env.googleClientSecret, env.googleRedirectUri)

export const googleProvider: GoogleProvider = {
  configured: Boolean(env.googleClientId && env.googleClientSecret),
  authorizationUrl(state, nonce, challenge) {
    return client.generateAuthUrl({
      scope: ['openid', 'email', 'profile'],
      state,
      nonce,
      code_challenge: challenge,
      code_challenge_method: CodeChallengeMethod.S256,
    })
  },
  async authenticate(code, verifier, nonce) {
    const { tokens } = await client.getToken({ code, codeVerifier: verifier })
    if (!tokens.id_token) throw new Error('Missing Google ID token')
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: env.googleClientId,
    })
    const payload = ticket.getPayload()
    if (!payload?.sub || !payload.email || !payload.email_verified || payload.nonce !== nonce) {
      throw new Error('Invalid Google identity')
    }
    return { googleId: payload.sub, email: payload.email, name: payload.name ?? payload.email }
  },
}
