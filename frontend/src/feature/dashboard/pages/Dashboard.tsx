import { useState } from 'react'
import { useAuth } from '@/feature/auth/AuthProvider'

export function Dashboard() {
  const { user, logout } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function handleLogout() {
    setBusy(true)
    setError(null)
    try {
      await logout()
    } catch {
      setError('Unable to sign out. Please try again.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}.</p>
      <p>{user?.email}</p>
      {error && <p role="alert">{error}</p>}
      <button type="button" disabled={busy} onClick={handleLogout}>
        {busy ? 'Signing out…' : 'Sign out'}
      </button>
    </main>
  )
}
