'use client'

import { useEffect, useRef, useState } from 'react'

export default function HyperText({ text = '', className = '', duration = 60 }) {
  const [displayText, setDisplayText] = useState('')
  const [isAnimating, setIsAnimating] = useState(true)
  const intervalRef = useRef(null)

  const shuffle = (s) => {
    const chars = '!<>-_\\/[]{}—=+*^?#________'
    return s.split('').map(() => chars[Math.floor(Math.random() * chars.length)]).join('')
  }

  useEffect(() => {
    if (!text || !isAnimating) return

    let step = 0
    const totalSteps = text.length

    intervalRef.current = setInterval(() => {
      step++
      const revealCount = Math.min(step, totalSteps)
      const revealed = text.slice(0, revealCount)
      const scrambled = shuffle(text.slice(revealCount))
      setDisplayText(revealed + scrambled)

      if (step >= totalSteps + 5) {
        clearInterval(intervalRef.current)
        setDisplayText(text)
        setIsAnimating(false)
      }
    }, duration)

    return () => clearInterval(intervalRef.current)
  }, [text, duration, isAnimating])

  if (!text) return null

  return (
    <span className={className}>
      {displayText || text}
    </span>
  )
}
