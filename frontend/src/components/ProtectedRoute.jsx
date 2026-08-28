import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAdmin, loading, checkAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const verify = async () => {
      const valid = await checkAuth()
      if (!valid) {
        navigate('/admin/login', { state: { from: location.pathname }, replace: true })
      }
    }
    verify()
  }, [checkAuth, location.pathname, navigate])

  if (loading) {
    return <div className="pt-[200px] text-center text-[#8a8a8a]">Memeriksa akses...</div>
  }

  if (!isAdmin) {
    return null
  }

  return children
}
