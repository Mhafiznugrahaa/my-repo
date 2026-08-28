'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useTheme } from '../lib/theme-context'

const techItems = [
  { label: 'PHP', color: '#777BB4', srcLight: 'https://svgl.app/library/php.svg', srcDark: 'https://svgl.app/library/php_dark.svg', hasDarkVariant: true },
  { label: 'Laravel', color: '#FF2D20', src: 'https://svgl.app/library/laravel.svg', hasDarkVariant: false },
  { label: 'Node.js', color: '#339933', src: 'https://svgl.app/library/nodejs.svg', hasDarkVariant: false },
  { label: 'Express', color: '#000000', srcLight: 'https://svgl.app/library/expressjs.svg', srcDark: 'https://svgl.app/library/expressjs_dark.svg', hasDarkVariant: true },
  { label: 'Go', color: '#00ADD8', srcLight: 'https://svgl.app/library/golang.svg', srcDark: 'https://svgl.app/library/golang_dark.svg', hasDarkVariant: true },
  { label: 'Python', color: '#3776AB', src: 'https://svgl.app/library/python.svg', hasDarkVariant: false },
  { label: 'TypeScript', color: '#3178C6', src: 'https://svgl.app/library/typescript.svg', hasDarkVariant: false },
  { label: 'JavaScript', color: '#F7DF1E', src: 'https://svgl.app/library/javascript.svg', hasDarkVariant: false },
  { label: 'Dart', color: '#02569B', src: 'https://svgl.app/library/dart.svg', hasDarkVariant: false },
  { label: 'Java', color: '#5382A1', src: 'https://svgl.app/library/java.svg', hasDarkVariant: false },
  { label: 'C++', color: '#00599C', src: 'https://svgl.app/library/c.svg', hasDarkVariant: false },
  { label: 'React', color: '#61DAFB', srcLight: 'https://svgl.app/library/react_light.svg', srcDark: 'https://svgl.app/library/react_dark.svg', hasDarkVariant: true },
  { label: 'Tailwind', color: '#06B6D4', src: 'https://svgl.app/library/tailwindcss.svg', hasDarkVariant: false },
  { label: 'Next.js', color: '#000000', srcLight: 'https://cdn.simpleicons.org/nextdotjs', srcDark: 'https://cdn.simpleicons.org/nextdotjs/white', hasDarkVariant: true },
  { label: 'Flask', color: '#000000', srcLight: 'https://svgl.app/library/flask-light.svg', srcDark: 'https://svgl.app/library/flask-dark.svg', hasDarkVariant: true },
  { label: 'Flutter', color: '#02569B', src: 'https://svgl.app/library/flutter.svg', hasDarkVariant: false },
  { label: 'Laragon', color: '#0E83CD', src: 'https://cdn.simpleicons.org/laragon', hasDarkVariant: false },
  { label: 'MySQL', color: '#4479A1', srcLight: 'https://svgl.app/library/mysql-icon-light.svg', srcDark: 'https://svgl.app/library/mysql-icon-dark.svg', hasDarkVariant: true },
  { label: 'MongoDB', color: '#47A248', srcLight: 'https://svgl.app/library/mongodb-icon-light.svg', srcDark: 'https://svgl.app/library/mongodb-icon-dark.svg', hasDarkVariant: true },
  { label: 'Turso', color: '#4FF8D2', src: 'https://cdn.simpleicons.org/turso', hasDarkVariant: false },
  { label: 'Firebase', color: '#FF9100', src: 'https://svgl.app/library/firebase.svg', hasDarkVariant: false },
  { label: 'Socket.IO', color: '#010101', srcLight: 'https://svgl.app/library/socketio-icon-light.svg', srcDark: 'https://svgl.app/library/socketio-icon-dark.svg', hasDarkVariant: true },
  { label: 'Git', color: '#F05032', src: 'https://svgl.app/library/git.svg', hasDarkVariant: false },
  { label: 'GitHub', color: '#181717', srcLight: 'https://cdn.simpleicons.org/github', srcDark: 'https://cdn.simpleicons.org/github/white', hasDarkVariant: true },
  { label: 'Docker', color: '#2496ED', src: 'https://svgl.app/library/docker.svg', hasDarkVariant: false },
  { label: 'Ngrok', color: '#1F1E37', srcLight: 'https://cdn.simpleicons.org/ngrok', srcDark: 'https://cdn.simpleicons.org/ngrok/white', hasDarkVariant: true },
  { label: 'Postman', color: '#FF6C37', src: 'https://svgl.app/library/postman.svg', hasDarkVariant: false },
  { label: 'Figma', color: '#F24E1E', src: 'https://svgl.app/library/figma.svg', hasDarkVariant: false },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25, duration: 0.6 } },
  hover: { y: -8, transition: { type: 'spring', stiffness: 400, damping: 20 } },
  tap: { scale: 0.92, transition: { type: 'spring', stiffness: 500, damping: 25 } },
}

function DockItem({ item }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [isHovered, setIsHovered] = useState(false)
  const { theme } = useTheme()

  const rotationY = useTransform(x, [-20, 0, 20], [-15, 0, 15])
  const rotationX = useTransform(y, [-20, 0, 20], [15, 0, -15])

  const glowOpacity = useSpring(
    useTransform(x, [-20, 0, 20], [0.3, 0, 0.3]),
    { stiffness: 300, damping: 25 }
  )
  const glowScale = useSpring(
    useTransform(x, [-20, 0, 20], [1.2, 1, 1.2]),
    { stiffness: 300, damping: 25 }
  )

  const logoSrc = item.hasDarkVariant
    ? (theme === 'dark' ? item.srcDark : item.srcLight)
    : item.src

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) / (rect.width / 2)
    const deltaY = (e.clientY - centerY) / (rect.height / 2)
    x.set(deltaX * 20)
    y.set(deltaY * 20)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="show"
      whileHover="hover"
      whileTap="tap"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); handleMouseLeave() }}
      className="group relative flex flex-col items-center"
    >
      <div
        className="relative w-12 h-12 flex items-center justify-center rounded-xl
          bg-white/80 dark:bg-black/80 backdrop-blur-sm
          border border-white/20 dark:border-white/10
          shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(255,255,255,0.02)]
          motion-safe:transition-all motion-safe:duration-300"
        style={{
          boxShadow: isHovered
            ? `0 12px 40px -10px ${item.color}66, 0 4px 20px -5px rgba(0,0,0,0.08)`
            : '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-xl blur-[30px] opacity-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${item.color}44 0%, transparent 70%)`,
            opacity: glowOpacity,
            scale: glowScale,
          }}
          animate={{ opacity: glowOpacity, scale: glowScale }}
        />

        {/* PENYESUAIAN PADA SPAN & IMG */}
        <motion.span
          style={{
            x,
            y,
            rotateX: rotationX,
            rotateY: rotationY,
            transformStyle: 'preserve-3d',
          }}
          className="relative z-10 w-full h-full p-2.5 flex items-center justify-center shrink-0"
        >
          <img
            src={logoSrc}
            alt={item.label}
            className="max-w-full max-h-full w-auto h-auto object-contain"
            draggable={false}
          />
        </motion.span>
      </div>

      <motion.span
        className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-medium text-[#8a8a8a] dark:text-white/40 whitespace-nowrap pointer-events-none px-2 py-1 rounded bg-white/90 dark:bg-black/90 backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-sm"
        initial={{ opacity: 0, y: 8, scale: 0.9 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8, scale: isHovered ? 1 : 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {item.label}
      </motion.span>
    </motion.div>
  )
}

export default function FloatingDock({ className = '' }) {
  return (
    <div className={className}>
      <p className="text-[11px] tracking-[0.25em] uppercase text-[#8a8a8a] dark:text-white/70 font-semibold mb-5 text-center md:text-left hover:text-[#555] dark:hover:text-white transition-colors duration-300">
        Tech Stack & Tools
      </p>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-5"
      >
        {techItems.map((item) => (
          <DockItem key={item.label} item={item} />
        ))}
      </motion.div>
    </div>
  )
}