import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const MotionLink = motion(Link)

export function PrimaryButton({ 
  children, 
  className = '', 
  as = 'button',
  href,
  to,
  ...props 
}) {
  const isNav = as === 'link' || as === 'a'
  const navProps = isNav ? (as === 'link' ? { to: to || href } : { href }) : {}

  if (isNav) {
    const Component = as === 'link' ? MotionLink : motion.a
    return (
      <Component
        {...navProps}
        className={`
          relative inline-flex items-center justify-center px-6 py-3 font-medium
          bg-black text-white border-2 border-black rounded-none
          hover:bg-white hover:text-black
          transition-all duration-300 ease-out
          ${className}
        `}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </Component>
    )
  }

  return (
    <motion.button
      className={`
        relative inline-flex items-center justify-center px-6 py-3 font-medium
        bg-black text-white border-2 border-black rounded-none
        hover:bg-white hover:text-black
        transition-all duration-300 ease-out
        ${className}
      `}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function SecondaryButton({ 
  children, 
  className = '', 
  as = 'button',
  href,
  to,
  ...props 
}) {
  const isNav = as === 'link' || as === 'a'
  const navProps = isNav ? (as === 'link' ? { to: to || href } : { href }) : {}

  if (isNav) {
    const Component = as === 'link' ? MotionLink : motion.a
    return (
      <Component
        {...navProps}
        className={`
          inline-flex items-center justify-center px-6 py-3 font-medium
          bg-white text-black border-2 border-black rounded-none
          dark:bg-black dark:text-white dark:border-white
          hover:translate-x-[-4px] hover:translate-y-[-4px]
          hover:shadow-[4px_4px_0px_#000000]
          dark:hover:shadow-[4px_4px_0px_#ffffff]
          transition-all duration-150 ease-out
          ${className}
        `}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </Component>
    )
  }

  return (
    <motion.button
      className={`
        inline-flex items-center justify-center px-6 py-3 font-medium
        bg-white text-black border-2 border-black rounded-none
        dark:bg-black dark:text-white dark:border-white
        hover:translate-x-[-4px] hover:translate-y-[-4px]
        hover:shadow-[4px_4px_0px_#000000]
        dark:hover:shadow-[4px_4px_0px_#ffffff]
        transition-all duration-150 ease-out
        ${className}
      `}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function TertiaryButton({ 
  children, 
  className = '', 
  as = 'button',
  variant = 'default',
  href,
  to,
  ...props 
}) {
  const isNav = as === 'link' || as === 'a'
  const navProps = isNav ? (as === 'link' ? { to: to || href } : { href }) : {}

  const variants = {
    default: 'border-[#8a8a8a] dark:border-white/30 bg-white dark:bg-white/5 text-[#111] dark:text-white',
    destructive: 'border-red-500 text-red-500 hover:bg-red-500/10',
  }

  if (isNav) {
    const Component = as === 'link' ? MotionLink : motion.a
    return (
      <Component
        {...navProps}
        className={`
          inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold
          border rounded-none
          ${variants[variant] || variants.default}
          hover:bg-[#111] hover:text-white
          dark:hover:bg-white dark:hover:text-[#111]
          transition-all duration-150 ease-out
          ${className}
        `}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </Component>
    )
  }

  return (
    <motion.button
      className={`
        inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold
        border rounded-none
        ${variants[variant] || variants.default}
        hover:bg-[#111] hover:text-white
        dark:hover:bg-white dark:hover:text-[#111]
        transition-all duration-150 ease-out
        ${className}
      `}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function PaginationButton({ 
  children, 
  active = false, 
  className = '',
  ...props 
}) {
  return (
    <motion.button
      className={`
        min-w-[40px] h-10 inline-flex items-center justify-center 
        border rounded-none text-sm font-semibold
        ${active 
          ? 'bg-black text-white border-black' 
          : 'border-[#8a8a8a] dark:border-white/30 text-[#111] dark:text-white hover:border-black dark:hover:border-white'
        }
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function AdminActionButton({ 
  children, 
  variant = 'primary',
  className = '',
  ...props 
}) {
  const variants = {
    primary: 'bg-black text-white border-black hover:bg-white hover:text-black',
    secondary: 'border-[#8a8a8a] bg-white text-[#111] hover:border-black',
    destructive: 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white',
    ghost: 'border-[#8a8a8a] bg-white text-[#111] hover:border-black',
  }

  return (
    <motion.button
      className={`
        inline-flex items-center justify-center px-5 py-2 text-xs font-semibold
        border rounded-none
        ${variants[variant]}
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function NavLink({ 
  children, 
  className = '',
  active = false,
  to,
  href,
  ...props 
}) {
  const isExternal = !!href
  const Component = isExternal ? motion.a : MotionLink
  const linkProps = isExternal ? { href } : { to }

  return (
    <Component
      {...linkProps}
      className={`
        inline-flex items-center justify-center px-4 py-2 text-sm font-medium
        rounded-none transition-all duration-200
        ${active 
          ? 'bg-black text-white' 
          : 'text-[#8a8a8a] dark:text-white/50 hover:text-[#111] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
        }
        ${className}
      `}
      whileHover={{ scale: 1.02, x: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </Component>
  )
}

export function MobileMenuButton({ 
  open = false, 
  onClick,
  className = '',
  ...props 
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`sm:hidden bg-none border-none cursor-pointer text-2xl ${className}`}
      whileHover={{ rotate: open ? 90 : -90, scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      {...props}
    >
      {open ? '✕' : '☰'}
    </motion.button>
  )
}

export function ThemeToggleButton({ children, className = '', ...props }) {
  return (
    <button
      className={`relative inline-flex items-center justify-center shrink-0 w-9 h-9 p-0 rounded-full 
        border border-black/[0.08] dark:border-white/[0.08] 
        bg-white/80 dark:bg-black/80 hover:bg-black/5 dark:hover:bg-white/10 
        transition-colors duration-300 leading-none ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function LinkButton({ 
  children, 
  className = '',
  variant = 'default',
  ...props 
}) {
  const variants = {
    default: 'text-[#111] dark:text-white hover:opacity-70',
    primary: 'font-semibold text-[#111] dark:text-white hover:opacity-70',
    muted: 'text-[#8a8a8a] dark:text-white/50 hover:text-[#111] dark:hover:text-white',
  }

  return (
    <motion.a
      className={`
        inline-flex items-center justify-center
        ${variants[variant]}
        ${className}
      `}
      whileHover={{ x: variant === 'default' ? 4 : 0, opacity: 0.7 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.a>
  )
}