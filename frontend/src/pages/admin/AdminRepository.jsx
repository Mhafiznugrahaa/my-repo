import { useState, useEffect, useCallback } from 'react'
import { adminRepoList, adminRepoSave, adminRepoUpdate, adminRepoDelete, adminRepoImport } from '../../api'
import { AdminActionButton, PaginationButton } from '../../components/Buttons'

const emptyForm = { name: '', description: '', language: '', github_url: '', stars: '0', status: 'published' }

export default function AdminRepository() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState('')
  const [jsonInput, setJsonInput] = useState('')
  const [importMsg, setImportMsg] = useState('')

  const load = useCallback(async () => {
    const res = await adminRepoList({ q: keyword, page })
    setItems(res.data); setLastPage(res.last_page)
  }, [keyword, page])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(emptyForm); setErrors(''); setModal('create') }
  const openEdit = (item) => { setForm({ ...item }); setErrors(''); setModal(item) }
  const closeModal = () => { setModal(null); setErrors('') }

  const handleSave = async (e) => {
    e.preventDefault(); setErrors('')
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('description', form.description)
    fd.append('language', form.language)
    fd.append('github_url', form.github_url)
    fd.append('stars', form.stars)
    fd.append('status', form.status)
    try {
      if (modal === 'create') await adminRepoSave(fd)
      else await adminRepoUpdate(modal.id, fd)
      closeModal(); load()
    } catch (err) { setErrors(err.msg || 'Gagal menyimpan') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus?')) return
    await adminRepoDelete(id); load()
  }

  const handleImport = async () => {
    if (!jsonInput.trim()) { setImportMsg('JSON tidak boleh kosong'); return }
    try {
      const res = await adminRepoImport(jsonInput)
      setImportMsg(res.msg); setJsonInput(''); load()
    } catch (err) { setImportMsg(err.msg || 'Gagal import') }
  }

  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-5 mb-12">
        <div><p className="text-xs tracking-[.22em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold mb-3">Dashboard</p><h1 className="text-3xl sm:text-4xl text-[#111] dark:text-white">Kelola Repository</h1></div>
        <AdminActionButton variant="primary" onClick={openCreate}>+ Tambah Manual</AdminActionButton>
      </div>

      {/* Import JSON */}
      <div className="border border-[#ececec] dark:border-white/10 rounded p-6 mb-10">
        <h3 className="text-base mb-3">Import dari File JSON</h3>
        <p className="text-sm text-[#8a8a8a] dark:text-white/50 mb-3">Tempel konten JSON dari file <code className="text-xs bg-[#fafafa] dark:bg-white/[0.04] px-1.5 py-0.5 rounded">github.com_Mhafiznugrahaa_tab_repositories.json</code></p>
        {importMsg && <div className={`text-sm font-semibold mb-3 p-3 border border-[#111] dark:border-white/30 rounded ${importMsg.includes('Berhasil') ? 'bg-[#fafafa] dark:bg-white/[0.04]' : 'bg-[#fafafa] dark:bg-white/[0.04]'}`}>{importMsg}</div>}
        <textarea value={jsonInput} onChange={e => setJsonInput(e.target.value)} placeholder="Tempel JSON di sini…" rows={4} className="font-mono text-xs text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded w-full mb-3 bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors resize-y" />
        <AdminActionButton variant="ghost" onClick={handleImport}>Import Repository</AdminActionButton>
      </div>

      <div className="flex gap-3 flex-wrap items-center mb-8">
        <input placeholder="Cari nama repo…" value={keyword} onChange={e => { setKeyword(e.target.value); setPage(1) }} className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded max-w-xs bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors" />
      </div>

      {items.length === 0 && <div className="py-20 text-center text-[#8a8a8a] dark:text-white/50 border border-dashed border-[#ececec] dark:border-white/10 rounded">Belum ada data.</div>}

      {items.length > 0 && (
        <div className="border border-[#ececec] dark:border-white/10 rounded overflow-hidden">
          <table className="w-full border-collapse">
            <thead><tr className="bg-[#fafafa] dark:bg-white/[0.04]">
              <th className="text-left px-5 py-4 text-[.72rem] tracking-[.12em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold">Nama</th>
              <th className="text-left px-5 py-4 text-[.72rem] tracking-[.12em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold hidden sm:table-cell">Bahasa</th>
              <th className="text-left px-5 py-4 text-[.72rem] tracking-[.12em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold hidden sm:table-cell w-[70px]">⭐</th>
              <th className="text-left px-5 py-4 text-[.72rem] tracking-[.12em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold hidden sm:table-cell">Status</th>
              <th className="text-right px-5 py-4 text-[.72rem] tracking-[.12em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold">Aksi</th>
            </tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-t border-[#ececec] dark:border-white/10 hover:bg-[#fafafa] dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4 text-sm font-semibold text-[#111] dark:text-white">{item.name}</td>
                  <td className="px-5 py-4 hidden sm:table-cell"><span className="text-[.7rem] tracking-[.12em] uppercase border border-[#ececec] dark:border-white/10 px-2.5 py-1 rounded-full font-semibold text-[#8a8a8a] dark:text-white/50">{item.language || '-'}</span></td>
                  <td className="px-5 py-4 hidden sm:table-cell text-sm text-[#8a8a8a] dark:text-white/50">{item.stars || 0}</td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className={`text-[.7rem] tracking-[.12em] uppercase px-2.5 py-1 rounded-full font-semibold ${
                      item.status === 'published'
                        ? 'bg-[#111] text-white'
                        : 'text-[#8a8a8a] dark:text-white/50 border border-[#ececec] dark:border-white/10'
                    }`}>{item.status}</span>
                  </td>
                  <td className="px-5 py-4 text-right"><div className="flex gap-2 justify-end">
                    <AdminActionButton variant="ghost" onClick={() => openEdit(item)}>Edit</AdminActionButton>
                    <AdminActionButton variant="destructive" onClick={() => handleDelete(item.id)}>Hapus</AdminActionButton>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {lastPage > 1 && (
        <div className="flex gap-2 justify-center mt-8 flex-wrap">
          {Array.from({ length: lastPage }, (_, i) => i + 1).map(p =>
            <PaginationButton key={p} active={p === page} onClick={() => setPage(p)}>{p}</PaginationButton>
          )}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-5 pb-10 bg-black/20 backdrop-blur-sm overflow-y-auto" onClick={closeModal}>
          <div className="w-full max-w-[640px] bg-white dark:bg-black/80 border border-[#ececec] dark:border-white/10 rounded p-8 sm:p-10" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl text-[#111] dark:text-white mb-6">{modal === 'create' ? 'Tambah Repository' : 'Edit Repository'}</h2>
            {errors && <div className="text-sm text-[#111] dark:text-white font-semibold mb-5 p-3 border border-[#111] dark:border-white/30 bg-[#fafafa] dark:bg-white/[0.04] rounded">{errors}</div>}
            <form onSubmit={handleSave}>
              <div className="mb-5">
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Nama Repository</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded w-full bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors" />
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Deskripsi</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded w-full bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors resize-y" />
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Bahasa</label>
                <input value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded w-full bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors" />
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">URL GitHub</label>
                <input value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded w-full bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors" />
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Stars</label>
                <input type="number" min="0" value={form.stars} onChange={e => setForm({ ...form, stars: e.target.value })} className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded w-full max-w-[200px] bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors" />
              </div>
              <div className="mb-6">
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded w-full bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors cursor-pointer">
                  <option value="published">Published (tampil di publik)</option>
                  <option value="draft">Draft (disembunyikan)</option>
                </select>
              </div>
              <div className="flex gap-3">
                <AdminActionButton variant="primary" type="submit">Simpan</AdminActionButton>
                <AdminActionButton variant="ghost" type="button" onClick={closeModal}>Batal</AdminActionButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
