import { createApp } from './app.js'
import { env } from './config/env.js'
import { prisma } from './prisma/client.js'
import { googleProvider } from './services/google.service.js'

await prisma.$connect()
const server = createApp(prisma, googleProvider).listen(env.port, '127.0.0.1', () => {
  console.log(`Backend running at http://localhost:${env.port}`)
  if (!googleProvider.configured)
    console.log('Add Google OAuth credentials to backend/.env to enable sign-in.')
})
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    server.close(() => {
      void prisma.$disconnect().then(() => process.exit(0))
    })
  })
}
