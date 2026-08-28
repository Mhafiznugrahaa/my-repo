import { useState, useEffect, useCallback } from 'react'
import { adminInfoList, adminInfoSave, adminInfoUpdate, adminInfoDelete } from '../../api'
import { AdminActionButton, PaginationButton } from '../../components/Buttons'

const emptyForm = { title: '', category: 'Umum', body: '', status: 'published', image: null, remove_image: '0' }

export default function AdminInformasi() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [modal, setModal] = useState(null) // null | 'create' | item (edit)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState('')

  const load = useCallback(async () => {
    const res = await adminInfoList({ q: keyword, page })
    setItems(res.data)
    setLastPage(res.last_page)
  }, [keyword, page])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(emptyForm); setErrors(''); setModal('create') }
  const openEdit = (item) => { setForm({ ...item, remove_image: '0' }); setErrors(''); setModal(item) }
  const closeModal = () => { setModal(null); setErrors('') }

  const handleSave = async (e) => {
    e.preventDefault(); setErrors('')
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('category', form.category)
    fd.append('body', form.body)
    fd.append('status', form.status)
    if (form.image instanceof File) fd.append('image', form.image)
    if (modal !== 'create') { fd.append('remove_image', form.remove_image) }
    try {
      if (modal === 'create') await adminInfoSave(fd)
      else await adminInfoUpdate(modal.id, fd)
      closeModal(); load()
    } catch (err) { setErrors(err.msg || 'Gagal menyimpan') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus?')) return
    await adminInfoDelete(id); load()
  }

  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-5 mb-12">
        <div><p className="text-xs tracking-[.22em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold mb-3">Dashboard</p><h1 className="text-3xl sm:text-4xl text-[#111] dark:text-white">Kelola Informasi</h1></div>
        <AdminActionButton variant="primary" onClick={openCreate}>+ Tambah Informasi</AdminActionButton>
      </div>

      <div className="flex gap-3 flex-wrap items-center mb-8">
        <input placeholder="Cari judul atau isi…" value={keyword} onChange={e => { setKeyword(e.target.value); setPage(1) }} className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded max-w-xs bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors" />
      </div>

      {items.length === 0 && <div className="py-20 text-center text-[#8a8a8a] dark:text-white/50 border border-dashed border-[#ececec] dark:border-white/10 rounded">Belum ada data.</div>}

      {items.length > 0 && (
        <div className="border border-[#ececec] dark:border-white/10 rounded overflow-hidden">
          <table className="w-full border-collapse">
            <thead><tr className="bg-[#fafafa] dark:bg-white/[0.04]">
              <th className="text-left px-5 py-4 text-[.72rem] tracking-[.12em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold">Judul</th>
              <th className="text-left px-5 py-4 text-[.72rem] tracking-[.12em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold hidden sm:table-cell">Kategori</th>
              <th className="text-left px-5 py-4 text-[.72rem] tracking-[.12em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold hidden sm:table-cell">Status</th>
              <th className="text-right px-5 py-4 text-[.72rem] tracking-[.12em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold">Aksi</th>
            </tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-t border-[#ececec] dark:border-white/10 hover:bg-[#fafafa] dark:hover:bg-white/5 dark:bg-transparent transition-colors">
                  <td className="px-5 py-4 text-sm font-semibold text-[#111] dark:text-white">{item.title}</td>
                  <td className="px-5 py-4 hidden sm:table-cell"><span className="text-[.7rem] tracking-[.12em] uppercase border border-[#ececec] dark:border-white/10 px-2.5 py-1 rounded-full font-semibold text-[#8a8a8a] dark:text-white/50">{item.category}</span></td>
                  <td className="px-5 py-4 hidden sm:table-cell"><span className={`text-[.7rem] tracking-[.12em] uppercase px-2.5 py-1 rounded-full font-semibold ${item.status === 'published' ? 'bg-[#111] text-white' : 'text-[#8a8a8a] dark:text-white/50 border border-[#ececec] dark:border-white/10'}`}>{item.status}</span></td>
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

      {/* Modal Form */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-5 pb-10 bg-black/20 backdrop-blur-sm overflow-y-auto" onClick={closeModal}>
          <div className="w-full max-w-[640px] bg-white dark:bg-black/80 border border-[#ececec] dark:border-white/10 rounded p-8 sm:p-10" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl text-[#111] dark:text-white mb-6">{modal === 'create' ? 'Tambah Informasi' : 'Edit Informasi'}</h2>
            {errors && <div className="text-sm text-[#111] dark:text-white font-semibold mb-5 p-3 border border-[#111] dark:border-white/30 bg-[#fafafa] dark:bg-white/[0.04] rounded">{errors}</div>}
            <form onSubmit={handleSave}>
              <div className="mb-5">
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Judul</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded w-full bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors" />
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Kategori</label>
                <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded w-full bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors" />
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Isi</label>
                <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} rows={6} className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded w-full bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors resize-y" />
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
              <div className="mb-6">
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded w-full max-w-[260px] bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors cursor-pointer">
                  <option value="published">Published (tampil di publik)</option>
                  <option value="draft">Draft (disembunyikan)</option>
                </select>
              </div>
              <div className="flex gap-3">
                <AdminActionButton type="submit" variant="primary">Simpan</AdminActionButton>
                <AdminActionButton type="button" variant="ghost" onClick={closeModal}>Batal</AdminActionButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
