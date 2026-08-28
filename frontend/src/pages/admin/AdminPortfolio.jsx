import { useState, useEffect, useCallback } from 'react'
import { adminPortfolioList, adminPortfolioSave, adminPortfolioUpdate, adminPortfolioDelete } from '../../api'
import { AdminActionButton, PaginationButton } from '../../components/Buttons'

const emptyForm = { title: '', description: '', category: 'Umum', project_url: '', image: null, remove_image: '0' }

export default function AdminPortfolio() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState('')

  const load = useCallback(async () => {
    const res = await adminPortfolioList({ q: keyword, page })
    setItems(res.data); setLastPage(res.last_page)
  }, [keyword, page])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(emptyForm); setErrors(''); setModal('create') }
  const openEdit = (item) => { setForm({ ...item, remove_image: '0' }); setErrors(''); setModal(item) }
  const closeModal = () => { setModal(null); setErrors('') }

  const handleSave = async (e) => {
    e.preventDefault(); setErrors('')
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('description', form.description)
    fd.append('category', form.category)
    fd.append('project_url', form.project_url)
    if (form.image instanceof File) fd.append('image', form.image)
    if (modal !== 'create') fd.append('remove_image', form.remove_image)
    try {
      if (modal === 'create') await adminPortfolioSave(fd)
      else await adminPortfolioUpdate(modal.id, fd)
      closeModal(); load()
    } catch (err) { setErrors(err.msg || 'Gagal menyimpan') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus?')) return
    await adminPortfolioDelete(id); load()
  }

  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-5 mb-12">
        <div><p className="text-xs tracking-[.22em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold mb-3">Dashboard</p><h1 className="text-3xl sm:text-4xl text-[#111] dark:text-white">Kelola Portofolio</h1></div>
        <AdminActionButton variant="primary" onClick={openCreate}>+ Tambah Proyek</AdminActionButton>
      </div>

      <div className="flex gap-3 flex-wrap items-center mb-8">
        <input placeholder="Cari judul…" value={keyword} onChange={e => { setKeyword(e.target.value); setPage(1) }} className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded max-w-xs bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors" />
      </div>

      {items.length === 0 && <div className="py-20 text-center text-[#8a8a8a] dark:text-white/50 border border-dashed border-[#ececec] dark:border-white/10 rounded">Belum ada data.</div>}

      {items.length > 0 && (
        <div className="border border-[#ececec] dark:border-white/10 rounded overflow-hidden">
          <table className="w-full border-collapse">
            <thead><tr className="bg-[#fafafa] dark:bg-white/[0.04]">
              <th className="text-left px-5 py-4 text-[.72rem] tracking-[.12em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold">Gambar</th>
              <th className="text-left px-5 py-4 text-[.72rem] tracking-[.12em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold">Judul</th>
              <th className="text-left px-5 py-4 text-[.72rem] tracking-[.12em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold hidden sm:table-cell">Kategori</th>
              <th className="text-right px-5 py-4 text-[.72rem] tracking-[.12em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold">Aksi</th>
            </tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-t border-[#ececec] dark:border-white/10 hover:bg-[#fafafa] dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">{item.image ? <img src={item.image} alt="" className="w-14 h-14 object-cover rounded border border-[#ececec] dark:border-white/10" /> : <span className="text-xs text-[#8a8a8a] dark:text-white/50">—</span>}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#111] dark:text-white">{item.title}</td>
                  <td className="px-5 py-4 hidden sm:table-cell"><span className="text-[.7rem] tracking-[.12em] uppercase border border-[#ececec] dark:border-white/10 px-2.5 py-1 rounded-full font-semibold text-[#8a8a8a] dark:text-white/50">{item.category}</span></td>
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
            <PaginationButton key={p} onClick={() => setPage(p)} active={p === page}>{p}</PaginationButton>
          )}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-5 pb-10 bg-black/20 backdrop-blur-sm overflow-y-auto" onClick={closeModal}>
          <div className="w-full max-w-[640px] bg-white dark:bg-black/80 border border-[#ececec] dark:border-white/10 rounded p-8 sm:p-10" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl text-[#111] dark:text-white mb-6">{modal === 'create' ? 'Tambah Proyek' : 'Edit Proyek'}</h2>
            {errors && <div className="text-sm text-[#111] dark:text-white font-semibold mb-5 p-3 border border-[#111] dark:border-white/30 bg-[#fafafa] dark:bg-white/[0.04] rounded">{errors}</div>}
            <form onSubmit={handleSave}>
              <div className="mb-5">
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Judul Proyek</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded w-full bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors" />
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Kategori</label>
                <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded w-full bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors" />
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Deskripsi</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded w-full bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors resize-y" />
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">URL Proyek</label>
                <input value={form.project_url} onChange={e => setForm({ ...form, project_url: e.target.value })} className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded w-full bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors" />
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Gambar (opsional)</label>
                {form.image && typeof form.image === 'string' && (
                  <div className="mb-3"><img src={form.image} alt="" className="max-w-[200px] border border-[#ececec] dark:border-white/10 rounded" />
                    <label className="inline-flex items-center gap-2 mt-2 text-sm cursor-pointer"><input type="checkbox" checked={form.remove_image === '1'} onChange={e => setForm({ ...form, remove_image: e.target.checked ? '1' : '0' })} /> Hapus gambar</label>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} className="font-sans text-sm text-[#2c2c2c] dark:text-white/70 px-3 py-2 border border-dashed border-[#ececec] dark:border-white/10 rounded w-full bg-white dark:bg-black/50 cursor-pointer hover:border-[#111] dark:hover:border-white/50" />
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
