import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPortofolio } from '../api'
import { imgSrc } from '../defaultImage'
import TextPressure from '../components/TextPressure'
import { useTheme } from '../lib/theme-context'

export default function Portofolio() {
  const [portfolios, setPortfolios] = useState([])
  const { theme } = useTheme()

  useEffect(() => { getPortofolio().then(setPortfolios).catch(() => {}) }, [])

  return (
    <>
      <div className="container-wide pt-[160px] sm:pt-[110px] pb-16 sm:pb-20">
        <div className="max-w-[520px]">
          <div className="h-[60px] sm:h-[80px] w-full mt-4">
            <TextPressure
              text="Portofolio"
              textColor={theme === 'dark' ? '#ffffff' : '#111111'}
              minFontSize={28}
              width
              weight
              italic
              // alpha={false}
              stroke={false}
              flex
            />
          </div>
          <p className="text-base text-[#666] dark:text-white/50 mt-4 max-w-[480px] leading-relaxed">Kumpulan proyek yang pernah saya kerjakan, dari tugas kuliah hingga proyek mandiri.</p>
        </div>
      </div>

      <hr className="border-0 h-px bg-[#ececec] dark:bg-white/10" />

      <section className="container-wide section-space">
        {portfolios.length === 0 && (
          <div className="py-28 text-center text-[#8a8a8a] dark:text-white/30 border border-dashed border-[#ececec] dark:border-white/10">Belum ada data portofolio.</div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {portfolios.map(p => (
            <Link key={p.id} to={`/portofolio/${p.id}`}
              className="group block border border-[#ececec] dark:border-white/10 bg-white dark:bg-white/5 card-hover">
              <div className="aspect-[16/11] overflow-hidden bg-[#f8f8f8] dark:bg-white/5">
                <img src={imgSrc(p.image, p.id)} alt={p.title}
                  className="w-full h-full object-cover motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out group-hover:scale-[1.03]" />
              </div>
              <div className="p-7 sm:p-8">
                <span className="tag-pill">{p.category}</span>
                <h3 className="text-lg font-bold text-[#111] dark:text-white mt-3 group-hover:opacity-70 motion-safe:transition-opacity motion-safe:duration-300">{p.title}</h3>
                <p className="text-sm text-[#555] dark:text-white/60 mt-2 leading-relaxed line-clamp-3">{p.description?.substring(0, 150)}{p.description?.length > 150 ? '…' : ''}</p>
                {p.tech_stacks?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2.5 mt-4">
                    {p.tech_stacks.map(ts => (
                      ts.icon
                        ? <img key={ts.id} src={ts.icon} alt={ts.name} title={ts.name} className="w-5 h-5 object-contain" />
                        : <span key={ts.id} title={ts.name} className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#8a8a8a] dark:text-white/40 border border-[#ececec] dark:border-white/10 px-2 py-0.5 rounded-full">{ts.name}</span>
                    ))}
                  </div>
                )}
                {p.project_url && (
                  <div className="mt-5 pt-4 border-t border-[#ececec] dark:border-white/10">
                    <span className="text-xs text-[#8a8a8a] dark:text-white/40 font-medium">Lihat proyek →</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
