import { useEffect, useState, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getTentang, getHome } from '../api'
import { PrimaryButton, SecondaryButton, TertiaryButton } from '../components/Buttons'
import { useTheme } from '../lib/theme-context'
import ViewCounter from '../components/ViewCounter'

const KineticText = lazy(() => import('../components/KineticText'))
const FloatingDock = lazy(() => import('../components/FloatingDock'))
const TextPressure = lazy(() => import('../components/TextPressure'))

function ProjectCard({ item }) {
  return (
    <Link to={`/portofolio/${item.id}`} className="group block border border-[#ececec] dark:border-white/10 bg-white dark:bg-white/5 card-hover">
      {item.image && (
        <div className="aspect-[16/11] overflow-hidden bg-[#f8f8f8] dark:bg-white/5">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]" />
        </div>
      )}
      <div className="p-7 sm:p-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="tag-pill">{item.category}</span>
        </div>
        <h3 className="text-lg font-bold text-[#111] dark:text-white group-hover:opacity-70 transition-opacity duration-300">{item.title}</h3>
        {item.description && (
          <p className="text-sm text-[#555] dark:text-white/60 mt-2 leading-relaxed line-clamp-2">{item.description.substring(0, 120)}{item.description.length > 120 ? '…' : ''}</p>
        )}
        {item.tech_stacks?.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {item.tech_stacks.map(ts => (
              ts.icon
                ? <img key={ts.id} src={ts.icon} alt={ts.name} title={ts.name} className="w-4 h-4 object-contain" />
                : <span key={ts.id} title={ts.name} className="text-[9px] font-semibold uppercase tracking-[.12em] text-[#8a8a8a] dark:text-white/40 border border-[#ececec] dark:border-white/10 px-2 py-0.5 rounded-full">{ts.name}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

function InfoCard({ item }) {
  return (
    <Link to={`/info/${item.id}`} className="group block border border-[#ececec] dark:border-white/10 bg-white dark:bg-white/5 card-hover">
      {item.image && (
        <div className="aspect-[16/11] overflow-hidden bg-[#f8f8f8] dark:bg-white/5">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]" />
        </div>
      )}
      <div className="p-7 sm:p-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="tag-pill">{item.category}</span>
          <span className="text-[11px] text-[#aaa] dark:text-white/30 font-medium">{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
        <h3 className="text-lg font-bold text-[#111] dark:text-white group-hover:opacity-70 transition-opacity duration-300">{item.title}</h3>
        <p className="text-sm text-[#555] dark:text-white/60 mt-2 leading-relaxed line-clamp-2">{item.body?.substring(0, 120)}{item.body?.length > 120 ? '…' : ''}</p>
      </div>
    </Link>
  )
}

function RepoCard({ repo }) {
  return (
    <a href={repo.github_url || '#'} target="_blank" rel="noopener noreferrer" className="group block border border-[#ececec] dark:border-white/10 rounded-sm p-6 card-hover bg-white dark:bg-white/5">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-bold text-[#111] dark:text-white group-hover:opacity-70 transition-opacity duration-300">{repo.name}</h3>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" className="mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
      </div>
      <p className="text-xs text-[#555] dark:text-white/60 leading-relaxed line-clamp-2 mb-4">{repo.description || '—'}</p>
      <div className="flex items-center gap-4">
        {repo.language && <span className="tag-pill text-[9px]">{repo.language}</span>}
        <span className="text-[11px] text-[#8a8a8a] dark:text-white/40 font-medium">⭐ {repo.stars || 0}</span>
      </div>
    </a>
  )
}

export default function Beranda() {
  const [data, setData] = useState(null)
  const { theme } = useTheme()

  useEffect(() => {
    // Mengambil data secara paralel agar tidak menimpa satu sama lain
    Promise.all([getHome(), getTentang()])
      .then(([homeRes, tentangRes]) => {
        setData({
          ...homeRes,
          profile: tentangRes?.profile || homeRes?.profile,
        })
      })
      .catch((err) => console.error('Error fetching data:', err))
  }, [])

  const p = data?.profile

  return (
    <>
      {/* ========== HERO SECTION ========== */}
      <section className="relative bg-white dark:bg-[#0a0a0a] transition-colors duration-500">
        <div className="container-wide relative z-10 min-h-[calc(100vh-86px)] flex items-center pt-[140px] sm:pt-[160px] pb-28 sm:pb-36">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center">

            {/* KOLOM KIRI — TEKS */}
            <div className="max-w-[820px]">
              <div className="eyebrow mb-2">Personal Portfolio</div>

              <div className="h-[50px] sm:h-[70px] lg:h-[90px] w-full">
                <Suspense fallback={<div className="h-full w-full" />}>
                  <TextPressure
                    text="mhafiznugraha"
                    textColor={theme === 'dark' ? '#ffffff' : '#111111'}
                    minFontSize={26}
                    maxFontSize={72}
                    width
                    weight
                    italic
                    stroke={false}
                    flex
                  />
                </Suspense>
              </div>

              {p?.bio && (
                <Suspense fallback={<p className="mt-2 text-base sm:text-lg text-[#555] dark:text-white/60 leading-relaxed max-w-[500px] animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded" />}>
                  <KineticText
                    text={p.bio}
                    as="p"
                    className="mt-2 text-base sm:text-lg text-[#555] dark:text-white/60 leading-relaxed max-w-[500px]"
                  />
                </Suspense>
              )}

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="mt-2 text-sm font-medium text-[#8a8a8a] dark:text-white/40 italic"
              >
                Learning, Coding, Sleeping Everywhere.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="inline-flex items-center justify-start gap-[20px] mt-6 w-fit"
              >
                <div className="w-fit">
                  <PrimaryButton as="link" to="/portofolio">Lihat Portofolio</PrimaryButton>
                </div>
                <div className="w-fit">
                  <SecondaryButton as="link" to="/tentang">Tentang Saya</SecondaryButton>
                </div>
                <div className="w-fit self-center">
                  <ViewCounter page="tentang" className="ml-4" />
                </div>
              </motion.div>
            </div>

            {/* KOLOM KANAN — FLOATING DOCK */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.2, 0.65, 0.3, 0.9] }}
              className="flex justify-center md:justify-end"
            >
              <Suspense fallback={<div className="w-full max-w-[420px] h-[420px] animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl" />}>
                <FloatingDock className="w-full max-w-[420px]" />
              </Suspense>
            </motion.div>

          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-[#0a0a0a] to-transparent pointer-events-none" />
      </section>

      {/* ===== PORTFOLIO PREVIEW ===== */}
      {data?.portfolios?.length > 0 && (
        <>
          <hr className="border-0 h-px bg-[#ececec] dark:bg-white/10" />
          <section className="container-wide section-space bg-white dark:bg-[#0a0a0a] transition-colors duration-500">
            <div className="max-w-[820px] mb-14">
              <span className="eyebrow">Karya Terbaru</span>
              <h2 className="mt-4 text-[#111] dark:text-white">Proyek Terbaru</h2>
              <p className="text-sm text-[#666] dark:text-white/50 mt-3 max-w-[480px]">Proyek terbaik yang pernah saya kerjakan, dari tugas kuliah hingga proyek mandiri.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {data.portfolios.map(p => <ProjectCard key={p.id} item={p} />)}
            </div>
            <div className="mt-12">
              <TertiaryButton as="link" to="/portofolio">
                Lihat Semua Proyek
              </TertiaryButton>
            </div>
          </section>
        </>
      )}

      {/* ===== REPOSITORIES ===== */}
      {data?.repositories?.length > 0 && (
        <>
          <hr className="border-0 h-px bg-[#ececec] dark:bg-white/10" />
          <section className="container-wide section-space-sm bg-white dark:bg-[#0a0a0a] transition-colors duration-500">
            <div className="max-w-[820px] mb-14">
              <span className="eyebrow">GitHub</span>
              <h2 className="mt-4 text-[#111] dark:text-white">Repository Terbaru</h2>
              <p className="text-sm text-[#666] dark:text-white/50 mt-3 max-w-[480px]">Koleksi repository open-source dan proyek yang pernah saya publikasikan.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.repositories.map(r => <RepoCard key={r.id} repo={r} />)}
            </div>
            <div className="mt-10">
              <TertiaryButton as="a" href="https://github.com/Mhafiznugrahaa" target="_blank" rel="noopener noreferrer">
                Lihat Semua Repository
              </TertiaryButton>
            </div>
          </section>
        </>
      )}

      {/* ===== INFO SECTION ===== */}
      {data?.informations?.length > 0 && (
        <>
          <hr className="border-0 h-px bg-[#ececec] dark:bg-white/10" />
          <section className="container-wide section-space-sm bg-white dark:bg-[#0a0a0a] transition-colors duration-500">
            <div className="max-w-[820px] mb-14">
              <span className="eyebrow">Informasi & Catatan</span>
              <h2 className="mt-4 text-[#111] dark:text-white">Artikel Terbaru</h2>
              <p className="text-sm text-[#666] dark:text-white/50 mt-3 max-w-[480px]">Kumpulan informasi dan catatan seputar proyek, pembelajaran, dan hal menarik lainnya.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {data.informations.map(i => <InfoCard key={i.id} item={i} />)}
            </div>
            <div className="mt-12">
              <TertiaryButton as="link" to="/informasi">
                Lihat Semua Informasi
              </TertiaryButton>
            </div>
          </section>
        </>
      )}
    </>
  )
}