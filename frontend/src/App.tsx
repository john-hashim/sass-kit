import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '@/feature/auth/AuthProvider'
import { Login } from '@/feature/auth/pages/Login'
import { Dashboard } from '@/feature/dashboard/pages/Dashboard'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

export function App() {
  const { loading, error, refresh } = useAuth()
  if (loading)
    return (
      <main>
        <p role="status">Loading…</p>
      </main>
    )
  if (error)
    return (
      <main>
        <p role="alert">{error}</p>
        <button type="button" onClick={() => void refresh()}>
          Retry
        </button>
      </main>
    )
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
