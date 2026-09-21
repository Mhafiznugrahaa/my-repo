import { useState, useEffect } from 'react'
import { getTentang, getTechStacks } from '../api'

const socials = [
  { key: 'github', label: 'GitHub', icon: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  { key: 'instagram', label: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
  { key: 'email', label: 'Email', icon: 'M0 3v18h24V3H0zm21.518 2L12 12.713 2.482 5h19.036zM2 19V7.183l10 8.104 10-8.104V19H2z' },
]

function RepoCard({ repo }) {
  return (
    <a href={repo.github_url || '#'} target="_blank" rel="noopener noreferrer"
      className="group block border border-[#d0d7de] dark:border-white/10 rounded-lg p-5
        hover:border-[#0969da] dark:hover:border-[#58a6ff]
        motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out
        bg-white dark:bg-white/5">
      <div className="flex items-center gap-2 mb-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="#656d76" className="dark:fill-white/40"><path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" /></svg>
        <h3 className="text-[14px] font-semibold text-[#0969da] dark:text-[#58a6ff] group-hover:underline">{repo.name}</h3>
      </div>
      <p className="text-[12px] text-[#656d76] dark:text-white/60 leading-[1.6] mb-4 line-clamp-2">{repo.description || ''}</p>
      <div className="flex items-center gap-4 text-[12px] text-[#656d76] dark:text-white/50">
        {repo.language && (
          <>
            <span className="w-3 h-3 rounded-full bg-[#f34b7d] inline-block flex-shrink-0" />
            <span>{repo.language}</span>
          </>
        )}
        <span className="flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" /></svg>
          {repo.stars || 0}
        </span>
      </div>
    </a>
  )
}

const skillGroups = [
  { key: 'backend', label: 'Backend Development' },
  { key: 'frontend', label: 'Frontend Development' },
  { key: 'database', label: 'Database' },
  { key: 'tools', label: 'Tools' },
]

export default function Tentang() {
  const [data, setData] = useState(null)
  const [techStacks, setTechStacks] = useState([])

  useEffect(() => { getTentang().then(setData).catch(() => {}) }, [])
  useEffect(() => { getTechStacks().then(setTechStacks).catch(() => {}) }, [])

  const p = data?.profile

  const categoryOf = (ts) => ts.category || 'tools'

  return (
    <>
      <div className="container-wide pt-[160px] sm:pt-[110px] pb-8">
        <div className="max-w-[820px]">
          <span className="eyebrow">Tentang</span>
        </div>
      </div>

      <section className="container-wide pb-28">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          <aside className="lg:w-[260px] lg:flex-shrink-0">
            <div className="lg:sticky lg:top-28">
              <div className="w-[260px] max-w-full">
                <div className="w-full aspect-square overflow-hidden border border-[#d0d7de] dark:border-white/10 rounded-full">
                  {p?.avatar && <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />}
                </div>
              </div>
              <h1 className="text-[24px] font-semibold text-[#1F2328] dark:text-white mt-4 leading-tight">{p?.name}</h1>
              <p className="text-[#656d76] dark:text-white/50 text-[16px] mt-0.5">{p?.username ? `@${p.username}` : ''}</p>
              <p className="text-[14px] text-[#1F2328] dark:text-white/80 mt-4 leading-[1.5]">{p?.bio}</p>
              {/* <p className="text-[#656d76] dark:text-white/50 text-[16px] mt-0.5">{p?.role ? `${p.role}` : ''}</p> */}

              <div className="mt-6 space-y-2">
                {socials.map(s => {
                  const url = p?.[s.key]
                  if (!url) return null
                  const isEmail = s.key === 'email'
                  const Component = 'a'
                  const href = isEmail ? `mailto:${url}` : url
                  return (
                    <Component key={s.key} href={href} target={isEmail ? undefined : '_blank'} rel={isEmail ? undefined : 'noopener noreferrer'}
                      className="flex items-center gap-2 text-[14px] text-[#656d76] dark:text-white/50 hover:text-[#0969da] dark:hover:text-[#58a6ff] motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0"><path d={s.icon} /></svg>
                      <span>{s.label}</span>
                    </Component>
                  )
                })}
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-6">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="#656d76" className="dark:fill-white/40"><path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" /></svg>
              <h2 className="text-[16px] font-semibold text-[#1F2328] dark:text-white">Pinned</h2>
            </div>

            {(!data?.repositories || data.repositories.length === 0) && (
              <div className="py-28 text-center text-[#8a8a8a] dark:text-white/30 border border-dashed border-[#d0d7de] dark:border-white/10 rounded-lg">
                <p className="text-[14px]">Belum ada repository.</p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              {data?.repositories?.map(r => <RepoCard key={r.id} repo={r} />)}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-[14px] text-[#656d76] dark:text-white/50">
              <a href="https://github.com/Mhafiznugrahaa" target="_blank" rel="noopener noreferrer"
                className="hover:text-[#0969da] dark:hover:text-[#58a6ff] motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" /></svg>
                <span className="font-semibold text-[#1F2328] dark:text-white">{data?.repositories?.length || 0}</span> Repositories
              </a>
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" /></svg>
                <span className="font-semibold text-[#1F2328] dark:text-white">{data?.repositories?.reduce((a, r) => a + (r.stars || 0), 0) || 0}</span> Stars
              </span>
            </div>
          </main>
        </div>
      </section>

      <section className="container-wide pb-28">
        <div className="max-w-[820px] mb-12">
          <span className="eyebrow">Keahlian</span>
        </div>

        {skillGroups.map(group => {
          const items = techStacks.filter(ts => categoryOf(ts) === group.key)
          if (items.length === 0) return null
          return (
            <div key={group.key} className="mb-14 last:mb-0">
              <h2 className="flex items-center gap-2.5 text-base font-semibold text-[#1F2328] dark:text-white mb-6">
                <span className="w-2 h-2 bg-[#1F2328] dark:bg-white rounded-sm flex-shrink-0" />
                {group.label}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {items.map(ts => (
                  <div key={ts.id} className="flex flex-col items-center justify-center gap-2.5 border border-[#d0d7de] dark:border-white/10 rounded-md bg-white dark:bg-white/5 px-3 py-5 text-center">
                    {ts.icon
                      ? <img src={ts.icon} alt={ts.name} className="w-8 h-8 object-contain" />
                      : <span className="w-8 h-8 inline-flex items-center justify-center text-sm font-bold text-[#8a8a8a] dark:text-white/40 border border-[#ececec] dark:border-white/10 rounded-sm">{ts.name.charAt(0)}</span>}
                    <span className="text-xs font-medium text-[#111] dark:text-white/80 leading-tight">{ts.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </section>
    </>
  )
}
