import { Navigate, useSearchParams } from 'react-router-dom'
import { ENDPOINTS } from '@/api/endpoints'
import { useAuth } from '@/feature/auth/AuthProvider'

export function Login() {
  const { user } = useAuth()
  const [params] = useSearchParams()
  if (user) return <Navigate to="/dashboard" replace />
  const error = params.get('error')
  return (
    <main>
      <h1>Multimedia Redaction Studio</h1>
      {error && (
        <p role="alert">
          {error === 'not_configured'
            ? 'Google sign-in is not configured yet. Add credentials to backend/.env.'
            : 'Google sign-in failed or was cancelled. Please try again.'}
        </p>
      )}
      <a href={ENDPOINTS.auth.google}>Sign in with Google</a>
    </main>
  )
}
