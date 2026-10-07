import { Navigate, Outlet } from 'react-router-dom'
import { useUserStore } from '@/store'

export function ProtectedRoute() {
  const { user } = useUserStore()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
