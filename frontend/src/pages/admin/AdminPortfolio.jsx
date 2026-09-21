import { useState, useEffect, useCallback, useRef } from 'react'
import { adminPortfolioList, adminPortfolioSave, adminPortfolioUpdate, adminPortfolioDelete, getTechStacks } from '../../api'
import { AdminActionButton, PaginationButton } from '../../components/Buttons'

const emptyForm = { title: '', description: '', category: 'Umum', project_url: '', image: null, remove_image: '0' }

let previewKey = 0

export default function AdminPortfolio() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState('')

  const [techStackLib, setTechStackLib] = useState([])
  const [selectedStackIds, setSelectedStackIds] = useState([])
  const [existingGallery, setExistingGallery] = useState([])
  const [removedGalleryIds, setRemovedGalleryIds] = useState([])
  const [newImages, setNewImages] = useState([])

  const newImagesRef = useRef([])

  const load = useCallback(async () => {
    const res = await adminPortfolioList({ q: keyword, page })
    setItems(res.data); setLastPage(res.last_page)
  }, [keyword, page])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    getTechStacks().then(setTechStackLib).catch(() => {})
  }, [])

  // Cleanup object URLs agar tidak bocor memory
  useEffect(() => { newImagesRef.current = newImages }, [newImages])
  useEffect(() => {
    return () => newImagesRef.current.forEach(img => { if (img.url?.startsWith('blob:')) URL.revokeObjectURL(img.url) })
  }, [])

  const openCreate = () => {
    setForm(emptyForm); setErrors('')
    setSelectedStackIds([]); setExistingGallery([])
    setRemovedGalleryIds([]); setNewImages([])
    setModal('create')
  }

  const openEdit = (item) => {
    setForm({ ...item, remove_image: '0' }); setErrors('')
    setSelectedStackIds((item.tech_stacks || []).map(ts => ts.id))
    setExistingGallery(item.images || [])
    setRemovedGalleryIds([]); setNewImages([])
    setModal(item)
  }

  const closeModal = () => { setModal(null); setErrors('') }

  const toggleStack = (id) => {
    setSelectedStackIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const addGalleryFiles = (e) => {
    const files = Array.from(e.target.files || [])
    const next = files.map(file => {
      previewKey += 1
      return { key: previewKey, file, url: URL.createObjectURL(file) }
    })
    setNewImages(prev => [...prev, ...next])
    e.target.value = ''
  }

  const removeNewImage = (key) => {
    setNewImages(prev => prev.filter(img => {
      if (img.key === key && img.url?.startsWith('blob:')) URL.revokeObjectURL(img.url)
      return img.key !== key
    }))
  }

  const markGalleryRemove = (id) => {
    setRemovedGalleryIds(prev => (prev.includes(id) ? prev : [...prev, id]))
  }

  const unmarkGalleryRemove = (id) => {
    setRemovedGalleryIds(prev => prev.filter(x => x !== id))
  }

  const handleSave = async (e) => {
    e.preventDefault(); setErrors('')
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('description', form.description)
    fd.append('category', form.category)
    fd.append('project_url', form.project_url)
    if (form.image instanceof File) fd.append('image', form.image)
    if (modal !== 'create') fd.append('remove_image', form.remove_image)

    selectedStackIds.forEach(id => fd.append('tech_stacks[]', String(id)))
    newImages.forEach(img => fd.append('images[]', img.file))
    removedGalleryIds.forEach(id => fd.append('remove_images[]', String(id)))

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

  const availableStacks = techStackLib.filter(ts => !selectedStackIds.includes(ts.id))

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
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Tech Stack (boleh lebih dari satu)</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedStackIds.length === 0 && <span className="text-xs text-[#8a8a8a] dark:text-white/40 italic">Belum ada tech stack dipilih.</span>}
                  {selectedStackIds.map(id => {
                    const ts = techStackLib.find(t => t.id === id)
                    if (!ts) return null
                    return (
                      <button type="button" key={ts.id} onClick={() => toggleStack(ts.id)}
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.1em] border border-[#111] dark:border-white/60 px-2.5 py-1.5 rounded bg-[#111] dark:bg-white text-white dark:text-[#111] hover:opacity-80 transition-all cursor-pointer">
                        {ts.icon && <img src={ts.icon} alt="" className="w-4 h-4 object-contain" />}
                        {ts.name}
                        <span className="opacity-60">✕</span>
                      </button>
                    )
                  })}
                </div>
                <select value="" onChange={e => { if (e.target.value) toggleStack(Number(e.target.value)) }}
                  className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded w-full max-w-[320px] bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors cursor-pointer">
                  <option value="">+ Pilih tech stack…</option>
                  {availableStacks.map(ts => <option key={ts.id} value={ts.id} className="dark:bg-[#111]">{ts.name}</option>)}
                </select>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Gambar Cover (opsional)</label>
                {form.image && typeof form.image === 'string' && (
                  <div className="mb-3"><img src={form.image} alt="" className="max-w-[200px] border border-[#ececec] dark:border-white/10 rounded" />
                    <label className="inline-flex items-center gap-2 mt-2 text-sm cursor-pointer"><input type="checkbox" checked={form.remove_image === '1'} onChange={e => setForm({ ...form, remove_image: e.target.checked ? '1' : '0' })} /> Hapus gambar</label>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} className="font-sans text-sm text-[#2c2c2c] dark:text-white/70 px-3 py-2 border border-dashed border-[#ececec] dark:border-white/10 rounded w-full bg-white dark:bg-black/50 cursor-pointer hover:border-[#111] dark:hover:border-white/50" />
              </div>

              <div className="mb-5">
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Galeri Gambar Detail (bisa pilih lebih dari satu)</label>

                {(existingGallery.length > 0 || newImages.length > 0) && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                    {existingGallery.map(img => {
                      const removed = removedGalleryIds.includes(img.id)
                      return (
                        <div key={`existing-${img.id}`} className={`relative border ${removed ? 'border-red-400 opacity-40' : 'border-[#ececec] dark:border-white/10'} rounded overflow-hidden group`}>
                          <img src={img.image_path} alt="" className="w-full aspect-[4/3] object-cover" />
                          <button type="button"
                            title={removed ? 'Batalkan penghapusan' : 'Hapus gambar'}
                            onClick={() => removed ? unmarkGalleryRemove(img.id) : markGalleryRemove(img.id)}
                            className={`absolute top-1.5 right-1.5 w-6 h-6 inline-flex items-center justify-center text-xs font-bold rounded-full text-white transition-all ${removed ? 'bg-[#111] dark:bg-white text-white dark:text-black' : 'bg-black/70'} hover:scale-110 cursor-pointer`}>
                            {removed ? '↺' : '✕'}
                          </button>
                          {removed && <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] font-bold uppercase tracking-wider bg-red-500 text-white text-center py-0.5 rounded">Dihapus</span>}
                        </div>
                      )
                    })}
                    {newImages.map(img => (
                      <div key={img.key} className="relative border border-[#ececec] dark:border-white/10 rounded overflow-hidden group">
                        <img src={img.url} alt="" className="w-full aspect-[4/3] object-cover" />
                        <button type="button" onClick={() => removeNewImage(img.key)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 inline-flex items-center justify-center text-xs font-bold rounded-full text-white bg-black/70 hover:scale-110 transition-all cursor-pointer">✕</button>
                      </div>
                    ))}
                  </div>
                )}

                <input type="file" accept="image/*" multiple onChange={addGalleryFiles}
                  className="font-sans text-sm text-[#2c2c2c] dark:text-white/70 px-3 py-2 border border-dashed border-[#ececec] dark:border-white/10 rounded w-full bg-white dark:bg-black/50 cursor-pointer hover:border-[#111] dark:hover:border-white/50" />
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