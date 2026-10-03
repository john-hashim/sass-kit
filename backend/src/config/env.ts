import 'dotenv/config'

const frontendUrl = new URL(process.env.FRONTEND_URL ?? 'http://localhost:5173').origin
const port = Number(process.env.PORT ?? 3001)
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT')
if (process.env.NODE_ENV === 'production' && !frontendUrl.startsWith('https://')) {
  throw new Error('Production FRONTEND_URL must use HTTPS')
}

export const env = {
  port,
  frontendUrl,
  secureCookies: process.env.NODE_ENV === 'production',
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI ?? `${frontendUrl}/api/auth/google/callback`,
}
