import { useState, useEffect, useCallback } from 'react'
import { adminTechStackList, adminTechStackSave, adminTechStackUpdate, adminTechStackDelete } from '../../api'
import { AdminActionButton, PaginationButton } from '../../components/Buttons'

const CATEGORY_LABELS = { backend: 'Backend', frontend: 'Frontend', database: 'Database', tools: 'Tools' }

const emptyForm = { name: '', category: 'tools', icon: null, remove_icon: '0' }

export default function AdminTechStack() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState('')

  const load = useCallback(async () => {
    const res = await adminTechStackList({ q: keyword, page })
    setItems(res.data); setLastPage(res.last_page)
  }, [keyword, page])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(emptyForm); setErrors(''); setModal('create') }
  const openEdit = (item) => { setForm({ ...item, icon: item.icon, remove_icon: '0' }); setErrors(''); setModal(item) }
  const closeModal = () => { setModal(null); setErrors('') }

  const handleSave = async (e) => {
    e.preventDefault(); setErrors('')
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('category', form.category || 'tools')
    if (form.icon instanceof File) fd.append('icon', form.icon)
    if (modal !== 'create') fd.append('remove_icon', form.remove_icon)
    try {
      if (modal === 'create') await adminTechStackSave(fd)
      else await adminTechStackUpdate(modal.id, fd)
      closeModal(); load()
    } catch (err) { setErrors(err.msg || 'Gagal menyimpan') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus?')) return
    await adminTechStackDelete(id); load()
  }

  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-5 mb-12">
        <div><p className="text-xs tracking-[.22em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold mb-3">Dashboard</p><h1 className="text-3xl sm:text-4xl text-[#111] dark:text-white">Kelola Tech Stack</h1></div>
        <AdminActionButton variant="primary" onClick={openCreate}>+ Tambah Tech Stack</AdminActionButton>
      </div>

      <div className="flex gap-3 flex-wrap items-center mb-8">
        <input placeholder="Cari nama…" value={keyword} onChange={e => { setKeyword(e.target.value); setPage(1) }} className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded max-w-xs bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors" />
      </div>

      {items.length === 0 && <div className="py-20 text-center text-[#8a8a8a] dark:text-white/50 border border-dashed border-[#ececec] dark:border-white/10 rounded">Belum ada data.</div>}

      {items.length > 0 && (
        <div className="border border-[#ececec] dark:border-white/10 rounded overflow-hidden">
          <table className="w-full border-collapse">
            <thead><tr className="bg-[#fafafa] dark:bg-white/[0.04]">
              <th className="text-left px-5 py-4 text-[.72rem] tracking-[.12em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold">Logo</th>
              <th className="text-left px-5 py-4 text-[.72rem] tracking-[.12em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold">Nama</th>
              <th className="text-left px-5 py-4 text-[.72rem] tracking-[.12em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold hidden sm:table-cell">Kategori</th>
              <th className="text-right px-5 py-4 text-[.72rem] tracking-[.12em] uppercase text-[#8a8a8a] dark:text-white/50 font-semibold">Aksi</th>
            </tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-t border-[#ececec] dark:border-white/10 hover:bg-[#fafafa] dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">{item.icon ? <img src={item.icon} alt="" className="w-10 h-10 object-contain rounded border border-[#ececec] dark:border-white/10 bg-white dark:bg-white/5" /> : <span className="text-xs text-[#8a8a8a] dark:text-white/50">—</span>}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#111] dark:text-white">{item.name}</td>
                  <td className="px-5 py-4 hidden sm:table-cell"><span className="text-[.7rem] tracking-[.12em] uppercase border border-[#ececec] dark:border-white/10 px-2.5 py-1 rounded-full font-semibold text-[#8a8a8a] dark:text-white/50">{CATEGORY_LABELS[item.category] || 'Tools'}</span></td>
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
            <h2 className="text-xl text-[#111] dark:text-white mb-6">{modal === 'create' ? 'Tambah Tech Stack' : 'Edit Tech Stack'}</h2>
            {errors && <div className="text-sm text-[#111] dark:text-white font-semibold mb-5 p-3 border border-[#111] dark:border-white/30 bg-[#fafafa] dark:bg-white/[0.04] rounded">{errors}</div>}
            <form onSubmit={handleSave}>
              <div className="mb-5">
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Nama</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="mis. React, Laravel, MySQL" className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded w-full bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors" />
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Kategori Keahlian</label>
                <select value={form.category || 'tools'} onChange={e => setForm({ ...form, category: e.target.value })} className="font-sans text-sm text-[#111] dark:text-white px-4 py-3 border border-[#ececec] dark:border-white/10 rounded w-full max-w-[320px] bg-white dark:bg-black/50 focus:outline-none focus:border-[#111] dark:focus:border-white/50 transition-colors cursor-pointer">
                  <option value="backend" className="dark:bg-[#111]">Backend</option>
                  <option value="frontend" className="dark:bg-[#111]">Frontend</option>
                  <option value="database" className="dark:bg-[#111]">Database</option>
                  <option value="tools" className="dark:bg-[#111]">Tools</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#8a8a8a] dark:text-white/50 mb-2">Logo / Icon (opsional)</label>
                {form.icon && typeof form.icon === 'string' && (
                  <div className="mb-3"><img src={form.icon} alt="" className="max-w-[80px] object-contain border border-[#ececec] dark:border-white/10 rounded bg-white dark:bg-white/5" />
                    <label className="inline-flex items-center gap-2 mt-2 text-sm cursor-pointer"><input type="checkbox" checked={form.remove_icon === '1'} onChange={e => setForm({ ...form, remove_icon: e.target.checked ? '1' : '0' })} /> Hapus logo</label>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={e => setForm({ ...form, icon: e.target.files[0] })} className="font-sans text-sm text-[#2c2c2c] dark:text-white/70 px-3 py-2 border border-dashed border-[#ececec] dark:border-white/10 rounded w-full bg-white dark:bg-black/50 cursor-pointer hover:border-[#111] dark:hover:border-white/50" />
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