import { useEffect, useState } from 'react'

export default function ImageSlider({ images, alt = '' }) {
  const list = (images || []).filter(Boolean)
  const [index, setIndex] = useState(0)

  useEffect(() => { setIndex(0) }, [list.length])

  useEffect(() => {
    if (list.length <= 1) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setIndex(i => (i + 1) % list.length)
      if (e.key === 'ArrowLeft') setIndex(i => (i - 1 + list.length) % list.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [list.length])

  if (list.length === 0) return null

  if (list.length === 1) {
    return (
      <div className="border border-[#ececec] dark:border-white/10 overflow-hidden">
        <img src={list[0]} alt={alt} className="w-full" />
      </div>
    )
  }

  const prev = () => setIndex(i => (i - 1 + list.length) % list.length)
  const next = () => setIndex(i => (i + 1) % list.length)

  return (
    <div className="relative border border-[#ececec] dark:border-white/10 overflow-hidden group">
      <img key={index} src={list[index]} alt={`${alt} - ${index + 1}`} className="w-full" />

      <button type="button" onClick={prev} aria-label="Gambar sebelumnya"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 inline-flex items-center justify-center text-2xl text-[#111] dark:text-white bg-white/80 dark:bg-black/60 border border-[#ececec] dark:border-white/10 rounded-full backdrop-blur-sm hover:bg-white dark:hover:bg-black hover:scale-105 motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out cursor-pointer">‹</button>

      <button type="button" onClick={next} aria-label="Gambar berikutnya"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 inline-flex items-center justify-center text-2xl text-[#111] dark:text-white bg-white/80 dark:bg-black/60 border border-[#ececec] dark:border-white/10 rounded-full backdrop-blur-sm hover:bg-white dark:hover:bg-black hover:scale-105 motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out cursor-pointer">›</button>

      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-semibold tracking-widest text-[#111] dark:text-white bg-white/80 dark:bg-black/60 border border-[#ececec] dark:border-white/10 rounded-full px-2.5 py-1 backdrop-blur-sm">
        {index + 1} / {list.length}
      </span>
    </div>
  )
}