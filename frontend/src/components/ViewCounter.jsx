import { useState, useEffect } from 'react'
import { getViewCount, incrementView } from '../api'

export default function ViewCounter({ page = 'tentang', className = '' }) {
  const [count, setCount] = useState(0)
  const [incremented, setIncremented] = useState(false)

  useEffect(() => {
    getViewCount(page).then((res) => {
      if (res?.views !== undefined) setCount(res.views)
    }).catch(() => {})
  }, [page])

  const increment = async () => {
    if (incremented) return
    setIncremented(true)
    try {
      const res = await incrementView(page)
      if (res?.views !== undefined) setCount(res.views)
    } catch {}
  }

  const formatCount = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <button
      onClick={increment}
      disabled={incremented}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium
        text-[#8a8a8a] dark:text-white/50 hover:text-[#111] dark:hover:text-white
        transition-colors duration-200 bg-white/50 dark:bg-white/5 backdrop-blur-sm
        border border-black/[0.05] dark:border-white/[0.05]
        ${incremented ? 'cursor-default' : 'cursor-pointer'} ${className}`}
      title="Jumlah pengunjung halaman ini"
      aria-label={`Halaman ini telah dilihat ${count} kali`}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span>{formatCount(count)}</span>
    </button>
  )
}