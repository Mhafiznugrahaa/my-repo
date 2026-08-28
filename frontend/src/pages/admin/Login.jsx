import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authLogin, authLogout } from '../../api'
import { useAuth } from '../../context/AuthContext'
import { AdminActionButton } from '../../components/Buttons'

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAdmin, checkAuth, logout } = useAuth()

  const from = location.state?.from?.pathname || '/admin'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authLogin(username, password)
      await checkAuth()
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.msg || 'Login gagal')
      await logout()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-white dark:bg-black transition-colors duration-300">
      <div className="w-full max-w-sm text-center">
        <a href="/" className="font-extrabold text-sm tracking-tight text-[#111] dark:text-white inline-block mb-2">mhafiznugraha</a>
        <h1 className="text-2xl text-[#111] dark:text-white mb-2">Masuk Admin</h1>
        <p className="text-sm text-[#8a8a8a] dark:text-white/50 mb-8">Hanya admin yang dapat mengelola konten.</p>
        {error && <div className="text-sm text-[#111] dark:text-white font-semibold mb-6 p-3 border border-[#111] dark:border-white/30 bg-[#fafafa] dark:bg-white/5 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-5">
            <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded w-full bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors"
              disabled={loading}
            />
          </div>
          <div className="mb-5">
            <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded w-full bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors"
              disabled={loading}
            />
          </div>
          <AdminActionButton 
            type="submit" 
            variant="primary" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </AdminActionButton>
        </form>
      </div>
    </div>
  )
}
