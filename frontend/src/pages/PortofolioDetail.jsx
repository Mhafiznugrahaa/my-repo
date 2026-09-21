import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPortofolioDetail } from '../api'
import { imgSrc } from '../defaultImage'
import { PrimaryButton } from '../components/Buttons'
import ImageSlider from '../components/ImageSlider'

export default function PortofolioDetail() {
  const { id } = useParams()
  const [portfolio, setPortfolio] = useState(null)

  useEffect(() => { getPortofolioDetail(id).then(setPortfolio).catch(() => setPortfolio(null)) }, [id])

  if (!portfolio) return <div className="pt-[240px] text-center text-[#8a8a8a] dark:text-white/40 motion-safe:transition-all motion-safe:duration-300">Memuat…</div>

  const gallery = (portfolio.images || []).map(img => img.image_path).filter(Boolean)
  const slides = [imgSrc(portfolio.image, portfolio.id), ...gallery]

  return (
    <article className="max-w-[720px] mx-auto pt-[160px] pb-28 px-6 sm:px-10">
      <div className="flex items-center justify-between gap-4 mb-8">
      <Link 
        to="/portofolio"
        className="group inline-flex items-center gap-2 text-sm text-[#8a8a8a] dark:text-white/50 font-medium
          hover:text-[#111] dark:hover:text-white motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
          className="motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover:-translate-x-1">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Kembali ke Portofolio
      </Link>

        <span className="text-xs text-[#8a8a8a] dark:text-white/40">Dibuat {new Date(portfolio.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>

    </div>


      <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-8">{portfolio.title}</h1>

      <div className="mb-12">
        <ImageSlider images={slides} alt={portfolio.title} />
      </div>

      {portfolio.description && (
        <div className="text-base sm:text-lg leading-[1.85] text-[#444] dark:text-white/70 whitespace-pre-wrap text-justify [hyphens:auto] mb-10">
          {portfolio.description}
        </div>
      )}

      {portfolio.tech_stacks?.length > 0 && (
        <section className="mb-12 pt-8 border-t border-[#ececec] dark:border-white/10">
          <h2 className="text-xs font-semibold tracking-[.22em] uppercase text-[#8a8a8a] dark:text-white/50 mb-5">Tech Stack</h2>
          <div className="flex flex-wrap items-center gap-3">
            {portfolio.tech_stacks.map(ts => (
              <div key={ts.id} className="inline-flex items-center gap-2 border border-[#ececec] dark:border-white/10 px-3.5 py-2 rounded bg-white dark:bg-white/5">
                {ts.icon
                  ? <img src={ts.icon} alt={ts.name} className="w-5 h-5 object-contain" />
                  : <span className="w-5 h-5 inline-flex items-center justify-center text-[10px] font-bold text-[#8a8a8a] dark:text-white/40 border border-[#ececec] dark:border-white/10 rounded-sm">{ts.name.charAt(0)}</span>}
                <span className="text-sm font-medium text-[#111] dark:text-white/80">{ts.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-4 items-center pt-8 border-t border-[#ececec] dark:border-white/10">
        {portfolio.project_url && (
          <PrimaryButton as="a" href={portfolio.project_url} target="_blank" rel="noopener noreferrer">
            Kunjungi Proyek
          </PrimaryButton>
        )}
      </div>
    </article>
  )
}