import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getInfoDetail } from '../api'
import { imgSrc } from '../defaultImage'
import ImageSlider from '../components/ImageSlider'

export default function InfoDetail() {
  const { id } = useParams()
  const [info, setInfo] = useState(null)

  useEffect(() => { getInfoDetail(id).then(setInfo).catch(() => setInfo(null)) }, [id])

  if (!info) return <div className="pt-[240px] text-center text-[#8a8a8a] dark:text-white/40 motion-safe:transition-all motion-safe:duration-300">Memuat…</div>

  return (
    <article className="max-w-[720px] mx-auto pt-[160px] pb-28 px-6 sm:px-10">
      {/* <Link to="/informasi"
        className="group inline-flex items-center gap-2 text-sm text-[#8a8a8a] dark:text-white/50 font-medium
          hover:text-[#111] dark:hover:text-white motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out mb-10">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
          className="motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover:-translate-x-1"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Kembali ke Informasi
      </Link>
      <div className="mb-4">
        <span className="tag-pill">{info.category}</span>
      </div> */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link 
          to="/informasi"
          className="group inline-flex items-center gap-2 text-sm text-[#8a8a8a] dark:text-white/50 font-medium
            hover:text-[#111] dark:hover:text-white motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            className="motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover:-translate-x-1">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Kembali ke Informasi
        </Link>

        {info.category && (
          <span className="tag-pill">{info.category}</span>
        )}
      </div>
      <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl">{info.title}</h1>
      <div className="flex items-center gap-3 mt-5 mb-12">
        <span className="text-sm text-[#8a8a8a] dark:text-white/40">Dipublikasikan {new Date(info.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>
      <div className="mb-12">
        <ImageSlider images={[imgSrc(info.image, info.id), ...(info.images || []).map(img => img.image_path).filter(Boolean)]} alt={info.title} />
      </div>
      <div className="text-base sm:text-lg leading-[1.9] text-[#444] dark:text-white/70 whitespace-pre-wrap text-justify [hyphens:auto]">{info.body}</div>
    </article>
  )
}
