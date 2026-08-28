import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getInformasi } from '../api'
import { imgSrc } from '../defaultImage'
import TextPressure from '../components/TextPressure'
import { useTheme } from '../lib/theme-context'

export default function Informasi() {
  const [params, setParams] = useSearchParams()
  const [data, setData] = useState(null)
  const { theme } = useTheme()
  const q = params.get('q') || ''
  const category = params.get('category') || ''
  const page = parseInt(params.get('page') || '1')

  useEffect(() => {
    getInformasi({ q, category, page }).then(setData).catch(() => {})
  }, [q, category, page])

  const updateParams = (updates) => {
    const next = new URLSearchParams(params)
    Object.entries(updates).forEach(([k, v]) => { if (v) next.set(k, v); else next.delete(k) })
    if (updates.q !== undefined || updates.category !== undefined) next.delete('page')
    setParams(next)
  }

  return (
    <>
      <div className="container-wide pt-[160px] sm:pt-[110px] pb-16 sm:pb-20">
        <div className="max-w-[820px]">
          <div className="h-[60px] sm:h-[80px] w-full mt-4">
            <TextPressure
              text="Informasi & Catatan"
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
          <p className="text-base text-[#666] dark:text-white/50 mt-4 max-w-[480px] leading-relaxed">Kumpulan informasi dan catatan seputar proyek, pembelajaran, dan hal menarik lainnya.</p>
        </div>
      </div>

      <hr className="border-0 h-px bg-[#ececec] dark:bg-white/10" />

      <section className="container-wide section-space">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-14">
          <input type="text" placeholder="Cari informasi…" defaultValue={q}
            onKeyDown={e => e.key === 'Enter' && updateParams({ q: e.target.value })}
            className="font-sans text-sm text-[#111] dark:text-white/80 px-5 py-3.5 border border-[#ececec] dark:border-white/10
              w-full sm:w-auto sm:min-w-[300px] focus:outline-none focus:border-[#111] dark:focus:border-white/50
              motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out
              bg-white dark:bg-white/5" />
          <select value={category} onChange={e => updateParams({ category: e.target.value })}
            className="font-sans text-sm text-[#111] dark:text-white/80 px-5 py-3.5 border border-[#ececec] dark:border-white/10
              w-full sm:w-auto sm:min-w-[200px] focus:outline-none focus:border-[#111] dark:focus:border-white/50
              motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out cursor-pointer
              bg-white dark:bg-white/5">
            <option value="" className="dark:bg-[#111]">Semua Kategori</option>
            {data?.categories?.map(c => <option key={c} value={c} className="dark:bg-[#111]">{c}</option>)}
          </select>
        </div>

        {data?.data?.length === 0 && (
          <div className="py-28 text-center text-[#8a8a8a] dark:text-white/30 border border-dashed border-[#ececec] dark:border-white/10">Belum ada informasi.</div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {data?.data?.map(info => (
            <Link key={info.id} to={`/info/${info.id}`}
              className="group block border border-[#ececec] dark:border-white/10 bg-white dark:bg-white/5 card-hover">
              <div className="aspect-[16/11] overflow-hidden bg-[#f8f8f8] dark:bg-white/5">
                <img src={imgSrc(info.image, info.id)} alt={info.title}
                  className="w-full h-full object-cover motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out group-hover:scale-[1.03]" />
              </div>
              <div className="p-7 sm:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="tag-pill">{info.category}</span>
                  <span className="text-[11px] text-[#aaa] dark:text-white/30 font-medium">{new Date(info.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <h3 className="text-lg font-bold text-[#111] dark:text-white group-hover:opacity-70 motion-safe:transition-opacity motion-safe:duration-300">{info.title}</h3>
                <p className="text-sm text-[#555] dark:text-white/60 mt-2 leading-relaxed line-clamp-3">{info.body?.substring(0, 130)}{info.body?.length > 130 ? '…' : ''}</p>
              </div>
            </Link>
          ))}
        </div>

        {data?.last_page > 1 && (
          <div className="flex gap-2 justify-center mt-14">
            {Array.from({ length: data.last_page }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => updateParams({ page: String(p) })}
                className={`min-w-[44px] h-11 inline-flex items-center justify-center border text-sm font-semibold motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out
                  ${p === page
                    ? 'bg-[#111] dark:bg-white text-white dark:text-[#111] border-[#111] dark:border-white'
                    : 'border-[#ececec] dark:border-white/10 text-[#111] dark:text-white/80 hover:border-[#111] dark:hover:border-white/50 bg-white dark:bg-white/5'}`}>{p}</button>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
