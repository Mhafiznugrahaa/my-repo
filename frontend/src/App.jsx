import { useState, useEffect, lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { authCheck } from './api'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './lib/theme-context'
import { Particles } from './components/Particles'

const Beranda = lazy(() => import('./pages/Beranda'))
const Informasi = lazy(() => import('./pages/Informasi'))
const InfoDetail = lazy(() => import('./pages/InfoDetail'))
const Portofolio = lazy(() => import('./pages/Portofolio'))
const PortofolioDetail = lazy(() => import('./pages/PortofolioDetail'))
const Tentang = lazy(() => import('./pages/Tentang'))
const AdminLogin = lazy(() => import('./pages/admin/Login'))
const AdminInformasi = lazy(() => import('./pages/admin/AdminInformasi'))
const AdminPortfolio = lazy(() => import('./pages/admin/AdminPortfolio'))
const AdminRepository = lazy(() => import('./pages/admin/AdminRepository'))
const AdminTechStack = lazy(() => import('./pages/admin/AdminTechStack'))

function AdminShell({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <header className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center bg-white/70 dark:bg-black/70 backdrop-blur-lg border-b border-[#ececec] dark:border-white/10">
        <div className="w-full max-w-[1120px] mx-auto px-5 sm:px-8 flex items-center justify-between">
          <a href="/" className="font-extrabold tracking-tight text-base text-[#111] dark:text-white">mhafiznugraha <span className="text-[#8a8a8a] dark:text-white/40 font-medium">/ Admin</span></a>
          <button className="sm:hidden bg-none border-none cursor-pointer text-xl text-[#111] dark:text-white" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '✕' : '☰'}</button>
          <nav className={`${menuOpen ? 'flex' : 'hidden'} sm:flex absolute sm:static top-[72px] left-0 right-0 flex-col sm:flex-row items-start sm:items-center gap-0 sm:gap-7 bg-white dark:bg-black sm:bg-transparent sm:dark:bg-transparent backdrop-blur-lg border-b sm:border-b-0 border-[#ececec] dark:border-white/10 p-5 sm:p-0`}>
            <a href="/admin" className="text-sm font-medium text-[#8a8a8a] dark:text-white/50 hover:text-[#111] dark:hover:text-white block sm:inline py-2 sm:py-0">Informasi</a>
            <a href="/admin/portofolio" className="text-sm font-medium text-[#8a8a8a] dark:text-white/50 hover:text-[#111] dark:hover:text-white block sm:inline py-2 sm:py-0">Portofolio</a>
            <a href="/admin/tech-stacks" className="text-sm font-medium text-[#8a8a8a] dark:text-white/50 hover:text-[#111] dark:hover:text-white block sm:inline py-2 sm:py-0">Tech Stack</a>
            <a href="/admin/repository" className="text-sm font-medium text-[#8a8a8a] dark:text-white/50 hover:text-[#111] dark:hover:text-white block sm:inline py-2 sm:py-0">Repository</a>
            <a href="/" className="text-sm font-medium text-[#8a8a8a] dark:text-white/50 hover:text-[#111] dark:hover:text-white block sm:inline py-2 sm:py-0">Lihat Situs</a>
            <button onClick={onLogout} className="text-sm font-medium text-[#8a8a8a] dark:text-white/50 hover:text-[#111] dark:hover:text-white block sm:inline py-2 sm:py-0">Keluar</button>
          </nav>
        </div>
      </header>
      <main className="pt-[128px] pb-20 px-5">
        <div className="max-w-[1120px] mx-auto">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

function AppContent() {
  const { isAdmin, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        {/* Admin Login — tanpa Navbar/Footer */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Dashboard — nested routes dengan AdminShell & page transition */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminShell onLogout={() => { logout(); window.location.href = '/admin/login' }} />
          </ProtectedRoute>
        }>
          <Route index element={<AdminInformasi />} />
          <Route path="portofolio" element={<AdminPortfolio />} />
          <Route path="tech-stacks" element={<AdminTechStack />} />
          <Route path="repository" element={<AdminRepository />} />
        </Route>

        {/* Halaman Publik dengan transisi */}
        <Route path="*" element={
          <>
            <Particles quantity={80} />
            <Navbar isAdmin={isAdmin} />
            <main className="flex-1">
              <AnimatePresence mode="wait">
                <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#111] dark:border-white" /></div>}>
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<PageTransition><Beranda /></PageTransition>} />
                    <Route path="/informasi" element={<PageTransition><Informasi /></PageTransition>} />
                    <Route path="/info/:id" element={<PageTransition><InfoDetail /></PageTransition>} />
                    <Route path="/portofolio" element={<PageTransition><Portofolio /></PageTransition>} />
                    <Route path="/portofolio/:id" element={<PageTransition><PortofolioDetail /></PageTransition>} />
                    <Route path="/tentang" element={<PageTransition><Tentang /></PageTransition>} />
                  </Routes>
                </Suspense>
              </AnimatePresence>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}