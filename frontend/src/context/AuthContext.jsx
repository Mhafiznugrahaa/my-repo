import { createContext, useContext, useState, useEffect } from 'react'
import { authCheck, authLogout } from '../api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const res = await authCheck()
      setIsAdmin(res.code === 0)
      return res.code === 0
    } catch {
      setIsAdmin(false)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authLogout()
    } catch {}
    setIsAdmin(false)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ isAdmin, loading, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)