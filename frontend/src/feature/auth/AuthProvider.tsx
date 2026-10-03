import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { getCurrentUser, signOut } from '@/api/services/auth'
import type { User } from '@/types/auth'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  logout: () => Promise<void>
}
const AuthContext = createContext<AuthState | null>(null)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setUser(await getCurrentUser())
    } catch {
      setError('Unable to connect to the backend. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    void refresh()
  }, [refresh])
  const logout = async () => {
    await signOut()
    setUser(null)
  }
  return (
    <AuthContext.Provider value={{ user, loading, error, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
export function useAuth() {
  const auth = useContext(AuthContext)
  if (!auth) throw new Error('useAuth requires AuthProvider')
  return auth
}
