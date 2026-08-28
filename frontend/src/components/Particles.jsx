import { useRef, useMemo, useEffect } from 'react'
import { useTheme } from '../lib/theme-context'

export function Particles({
  quantity = 100,
  className = '',
  color,
}) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationIdRef = useRef(0)

  const { theme } = useTheme()

  const particleColor = useMemo(() => {
    if (theme === 'dark') return color || '#ffffff'
    return color || '#000000'
  }, [theme, color])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      canvas.width = w * 2
      canvas.height = h * 2
      ctx.scale(2, 2)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    particlesRef.current = Array.from({ length: quantity }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 4 + 0.5,
      baseOpacity: Math.random() * 0.4 + 0.1,
      angle: Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * 0.15,
      driftY: (Math.random() - 0.5) * 0.15 - 0.06,
      opacitySpeed: Math.random() * 0.008 + 0.002,
      opacityPhase: Math.random() * Math.PI * 2,
    }))

    const animate = () => {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p) => {
        p.angle += 0.005
        const waveX = Math.sin(p.angle * 0.7) * 0.3
        const waveY = Math.cos(p.angle * 0.5) * 0.3

        p.x += p.driftX + waveX
        p.y += p.driftY + waveY

        const opacityFactor = Math.sin(p.angle * p.opacitySpeed * 50 + p.opacityPhase) * 0.5 + 0.5
        const currentOpacity = p.baseOpacity * (0.3 + opacityFactor * 0.7)

        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        if (p.y < -10) p.y = canvas.height + 10
        if (p.y > canvas.height + 10) p.y = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.globalAlpha = currentOpacity
        ctx.fill()
      })

      animationIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationIdRef.current)
    }
  }, [quantity, particleColor])

  return (
    <div
      className={`fixed inset-0 z-0 pointer-events-none ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}