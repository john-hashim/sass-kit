import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AccountSettings } from '@/feature/account/pages/AccountSettings'
import { Login } from '@/feature/auth/pages/Login'
import { Dashboard } from '@/feature/dashboard/pages/Dashboard'
import { WorkspacePlaceholder } from '@/feature/dashboard/pages/WorkspacePlaceholder'
import { StudioLayout } from '@/feature/layout/StudioLayout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { useUserStore } from '@/store'

export function App() {
  const { initialized, loading, error, refresh } = useUserStore()
  useEffect(() => {
    void refresh()
  }, [refresh])
  if (!initialized || loading)
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center gap-4 p-6">
        <p role="status">Loading…</p>
      </main>
    )
  if (error)
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center gap-4 p-6">
        <p role="alert">{error}</p>
        <Button variant="primary" type="button" onClick={() => void refresh()}>
          Retry
        </Button>
      </main>
    )
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<StudioLayout />}>
          <Route path="/files" element={<WorkspacePlaceholder page="Files" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/overview" element={<Navigate to="/dashboard" replace />} />
          <Route path="/activity-log" element={<WorkspacePlaceholder page="Activity Log" />} />
          <Route path="/account" element={<AccountSettings />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/files" replace />} />
    </Routes>
  )
}
