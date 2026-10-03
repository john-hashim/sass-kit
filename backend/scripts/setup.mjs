import { constants } from 'node:fs'
import { copyFile } from 'node:fs/promises'

try {
  await copyFile(
    new URL('../.env.example', import.meta.url),
    new URL('../.env', import.meta.url),
    constants.COPYFILE_EXCL
  )
  console.log('Created backend/.env. Add Google OAuth credentials to enable sign-in.')
} catch (error) {
  if (error.code !== 'EEXIST') throw error
  console.log('Kept existing backend/.env.')
}
