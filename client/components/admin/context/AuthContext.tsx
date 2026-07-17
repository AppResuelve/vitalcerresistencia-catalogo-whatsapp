// @ts-nocheck
'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import api, { resetLogoutFlag } from '@/services/admin-api'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      try { setUser(JSON.parse(savedUser)) }
      catch { localStorage.removeItem('token'); localStorage.removeItem('user') }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const h = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null) }
    window.addEventListener('auth:logout', h)
    return () => window.removeEventListener('auth:logout', h)
  }, [])

  const login = async (email, password) => {
    resetLogoutFlag()
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const logout = () => { resetLogoutFlag(); localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null) }

  return <AuthCtx.Provider value={{ user, loading, login, logout }}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
