import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials)
    const { user: userData, token: userToken } = res.data
    localStorage.setItem('token', userToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(userToken)
    setUser(userData)
    // hapus cache user sebelumnya agar tidak bocor
    queryClient.clear()
    return userData
  }, [queryClient])

  const register = useCallback(async (data) => {
    const res = await authService.register(data)
    const { user: userData, token: userToken } = res.data
    localStorage.setItem('token', userToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(userToken)
    setUser(userData)
    queryClient.clear()
    return userData
  }, [queryClient])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    // bersihkan semua cache saat logout
    queryClient.clear()
  }, [queryClient])

  const refreshUser = useCallback(async () => {
    try {
      const res = await authService.getMe()
      const updated = res.data
      localStorage.setItem('user', JSON.stringify(updated))
      setUser(updated)
    } catch {
      logout()
    }
  }, [logout])

  useEffect(() => {
    if (token) {
      authService.getMe()
        .then((res) => {
          setUser(res.data)
          localStorage.setItem('user', JSON.stringify(res.data))
        })
        .catch(() => logout())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, token, loading, isAdmin, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
