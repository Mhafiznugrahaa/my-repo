import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from './ThemeToggle'

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/informasi', label: 'Informasi' },
  { to: '/portofolio', label: 'Portofolio' },
  { to: '/tentang', label: 'Tentang' },
]

const CHARS = '!<>-_\\/[]{}—=+*^?#________'
function scrambleText(text) {
  return text.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
}

function Logo() {
  const [hovering, setHovering] = useState(false)
  const [display, setDisplay] = useState('mhafiznugraha')
  const base = 'mhafiznugraha'

  useEffect(() => {
    if (!hovering) { setDisplay(base); return }
    let steps = 0
    const maxSteps = 10
    const interval = setInterval(() => {
      steps++
      if (steps >= maxSteps) {
        setDisplay(base)
        clearInterval(interval)
        return
      }
      const revealCount = Math.floor((steps / maxSteps) * base.length)
      const revealed = base.slice(0, revealCount)
      const scrambled = scrambleText(base.slice(revealCount))
      setDisplay(revealed + scrambled)
    }, 40)
    return () => clearInterval(interval)
  }, [hovering])

  return (
    <Link
      to="/"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="text-sm md:text-base font-extrabold tracking-tight text-[#111] dark:text-white whitespace-nowrap transition-colors duration-300"
    >
      {display}<span className="text-[#8a8a8a] dark:text-white/40 font-normal">.id</span>
    </Link>
  )
}

export default function Navbar({ isAdmin }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 30) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  const linkClass = (to) =>
    `text-sm font-medium transition-colors duration-300
     ${pathname === to ? 'text-[#111] dark:text-white' : 'text-[#8a8a8a] dark:text-white/50 hover:text-[#111] dark:hover:text-white'}`

  const appleSpring = { type: 'spring', stiffness: 190, damping: 34, mass: 1 }

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: scrolled ? 16 : 0 }}
        transition={appleSpring}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 md:px-6 lg:px-8 pointer-events-none"
      >
        <motion.div
          initial={false}
          animate={{
            width: scrolled ? '800px' : '100%',
            height: scrolled ? '54px' : '76px',
            borderRadius: scrolled ? '9999px' : '0px',
          }}
          transition={appleSpring}
          className={`flex items-center justify-between mx-auto pointer-events-auto
            backdrop-blur-sm transition-colors duration-500 ease-out
            ${scrolled
              ? 'bg-white/70 dark:bg-black/70 border border-black/[0.08] dark:border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(255,255,255,0.02)] px-5 md:px-7'
              : 'bg-white/80 dark:bg-black/80 border-b border-[#ececec] dark:border-white/[0.06] px-4 md:px-8 shadow-none'
            }`}
        >
          <Logo />

          <button
            className="md:hidden bg-none border-none cursor-pointer p-2 -mr-1.5 text-[#111] dark:text-white z-50 focus:outline-none"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              {open ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M3 5h14M3 10h14M3 15h14" />}
            </svg>
          </button>

          <nav className="hidden md:flex items-center gap-6 lg:gap-10 whitespace-nowrap">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className={linkClass(l.to)}>{l.label}</Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium text-[#8a8a8a] dark:text-white/50 hover:text-[#111] dark:hover:text-white transition-colors duration-300">Dashboard</Link>
            )}
            <ThemeToggle />
          </nav>
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ top: scrolled ? '80px' : '92px' }}
            className="md:hidden fixed left-4 right-4 max-w-md mx-auto z-40"
          >
            <nav className="flex flex-col bg-white/70 dark:bg-black/70 backdrop-blur-sm border border-black/[0.08] dark:border-white/[0.08] rounded-3xl px-6 py-2 shadow-2xl">
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                  className={`text-sm font-medium transition-colors duration-300 py-3.5 w-full border-b border-black/[0.05] dark:border-white/[0.05] last:border-b-0
                    ${pathname === l.to ? 'text-[#111] dark:text-white' : 'text-[#8a8a8a] dark:text-white/50 hover:text-[#111] dark:hover:text-white'}`}>
                  {l.label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" onClick={() => setOpen(false)}
                  className="text-sm font-medium text-[#8a8a8a] dark:text-white/50 hover:text-[#111] dark:hover:text-white transition-colors duration-300 py-3.5 w-full">Dashboard</Link>
              )}
              
              {/* PERBAIKAN DI SINI: Tambahkan flex, items-center, justify-center */}
              <div className="pt-3 pb-2 flex items-center justify-center w-full">
                <ThemeToggle />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}