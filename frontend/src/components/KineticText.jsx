'use client'

import { motion } from 'framer-motion'

export default function KineticText({ text = '', className = '', as: Tag = 'h1' }) {
  if (!text) return null

  const letters = text.split('')

  return (
    <Tag className={className}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20, rotateX: 90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.4,
            delay: i * 0.04,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </Tag>
  )
}
