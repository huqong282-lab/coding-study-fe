import { ChangeEvent, FormEvent, ReactNode, useMemo, useState } from 'react'

type CategoryStatus = 'Aktif' | 'Draft'

type Category = {
  id: number
  name: string
  slug: string
  description: string
  icon?: string
  courseCount: number
  status: CategoryStatus
}

const DUMMY_CATEGORIES: Category[] = [
  { id: 1, name: 'Web Development', slug: 'web-development', description: 'Pelajari pengembangan website modern dari dasar hingga mahir.', icon: '🌐', courseCount: 24, status: 'Aktif' },
  { id: 2, name: 'Mobile Development', slug: 'mobile-development', description: 'Kelas untuk membangun aplikasi mobile.', icon: '📱', courseCount: 18, status: 'Aktif' },
  { id: 3, name: 'Data Science', slug: 'data-science', description: 'Eksplorasi data, analitik, dan machine learning.', icon: '📊', courseCount: 12, status: 'Aktif' },
  { id: 4, name: 'UI/UX Design', slug: 'ui-ux-design', description: 'Rancang pengalaman digital yang intuitif.', icon: '✦', courseCount: 9, status: 'Draft' },
  { id: 5, name: 'Cyber Security', slug: 'cyber-security', description: 'Pahami dasar keamanan sistem dan jaringan.', icon: '🛡️', courseCount: 7, status: 'Draft' },
]

type FormValues = Pick<Category, 'name' | 'slug' | 'description' | 'status' | 'icon'>

const EMPTY_FORM: FormValues = { name: '', slug: '', description: '', icon: '', status: 'Aktif' }

function SearchIcon() {
  return <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="m20 20-4.2-4.2" /></svg>
}

function PencilIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></svg>
}

function TrashIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2m-1 0-.7 14H9.7L9 6" /></svg>
}

function ImageIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m21 16-5-5L5 20" /></svg>
}

type CategoryManagementScreenProps = {
  embedded?: boolean
}

function CategoryManagementScreen({ embedded = false }: CategoryManagementScreenProps) {
  const [categories, setCategories] = useState(DUMMY_CATEGORIES)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All Status' | CategoryStatus>('All Status')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [form, setForm] = useState<FormValues>(EMPTY_FORM)
  const [iconPreview, setIconPreview] = useState('')

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return categories.filter((category) => {
      const matchesSearch = !keyword || [category.name, category.slug].some((value) => value.toLowerCase().includes(keyword))
      const matchesStatus = statusFilter === 'All Status' || category.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [categories, search, statusFilter])

  const openCreateModal = () => {
    setEditingCategory(null)
    setForm(EMPTY_FORM)
    setIconPreview('')
    setIsModalOpen(true)
  }

  const openEditModal = (category: Category) => {
    setEditingCategory(category)
    setForm(category)
    setIconPreview(category.icon || '')
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const updateForm = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleNameChange = (value: string) => {
    setForm((current) => ({
      ...current,
      name: value,
      slug: editingCategory ? current.slug : value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }))
  }

  const handleIconUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setIconPreview(previewUrl)
    updateForm('icon', previewUrl)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.name.trim() || !form.slug.trim()) return

    if (editingCategory) {
      setCategories((current) => current.map((category) => category.id === editingCategory.id ? { ...category, ...form, name: form.name.trim(), slug: form.slug.trim() } : category))
    } else {
      setCategories((current) => [...current, { id: Date.now(), ...form, name: form.name.trim(), slug: form.slug.trim(), courseCount: 0 }])
    }
    closeModal()
  }

  const handleDelete = (id: number) => {
    setCategories((current) => current.filter((category) => category.id !== id))
  }

  return (
    <main className={`${embedded ? 'min-h-0 bg-transparent' : 'min-h-screen bg-[#070613]'} px-4 py-7 text-slate-200 sm:px-6 lg:px-10 lg:py-10`}>
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Manajemen Kategori</h1>
            <p className="mt-2 text-sm text-slate-400">Kelola kategori kelas agar materi mudah ditemukan oleh peserta.</p>
          </div>
          <button type="button" onClick={openCreateModal} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition hover:bg-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-900">
            <span className="text-lg leading-none">+</span> Tambah Kategori
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0b1f] shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <SearchIcon />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama atau slug kategori..." className="h-11 w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:bg-white/10 focus:ring-4 focus:ring-violet-500/15" />
            </div>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-medium text-slate-300 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15">
              <option>All Status</option><option>Aktif</option><option>Draft</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-6 py-4 font-semibold">Icon</th><th className="px-3 py-4 font-semibold">Nama Kategori</th><th className="px-3 py-4 font-semibold">Slug</th><th className="px-3 py-4 font-semibold">Jumlah Kelas</th><th className="px-3 py-4 font-semibold">Status</th><th className="px-6 py-4 text-right font-semibold">Aksi</th></tr>
              </thead>
              <tbody className="divide-y divide-white/[0.07]">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="transition hover:bg-white/[0.035]">
                    <td className="px-6 py-4"><CategoryIcon icon={category.icon} name={category.name} /></td>
                    <td className="px-3 py-4"><p className="font-semibold text-slate-100">{category.name}</p><p className="mt-1 max-w-56 truncate text-xs text-slate-500">{category.description}</p></td>
                    <td className="px-3 py-4"><code className="rounded-md bg-white/[0.06] px-2 py-1 text-xs text-slate-400">{category.slug}</code></td>
                    <td className="px-3 py-4 font-medium text-slate-300">{category.courseCount} kelas</td>
                    <td className="px-3 py-4"><StatusBadge status={category.status} /></td>
                    <td className="px-6 py-4"><div className="flex justify-end gap-1"><IconButton label={`Edit ${category.name}`} onClick={() => openEditModal(category)}><PencilIcon /></IconButton><IconButton label={`Hapus ${category.name}`} onClick={() => handleDelete(category.id)} danger><TrashIcon /></IconButton></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCategories.length === 0 && <div className="px-6 py-14 text-center"><p className="font-semibold text-slate-200">Kategori tidak ditemukan</p><p className="mt-1 text-sm text-slate-500">Coba gunakan kata kunci atau filter status lain.</p></div>}
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="category-modal-title" onMouseDown={(event) => { if (event.currentTarget === event.target) closeModal() }}>
          <form onSubmit={handleSubmit} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#121027] shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/10 px-6 py-5"><div><h2 id="category-modal-title" className="text-xl font-bold text-white">{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</h2><p className="mt-1 text-sm text-slate-400">Lengkapi informasi kategori kelas.</p></div><button type="button" onClick={closeModal} className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Tutup modal">✕</button></div>
            <div className="space-y-5 px-6 py-5">
              <Field label="Nama Kategori" required><input required value={form.name} onChange={(event) => handleNameChange(event.target.value)} placeholder="Contoh: Web Development" className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15" /></Field>
              <Field label="Slug" required><input required value={form.slug} onChange={(event) => updateForm('slug', event.target.value)} placeholder="web-development" className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15" /></Field>
              <Field label="Deskripsi"><textarea value={form.description} onChange={(event) => updateForm('description', event.target.value)} placeholder="Deskripsi singkat kategori" rows={3} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15 resize-none" /></Field>
              <Field label="Upload Icon"><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/15 p-3 transition hover:border-violet-400 hover:bg-violet-500/10"><CategoryIcon icon={iconPreview} name={form.name || 'Kategori'} small /><span className="flex-1"><span className="block text-sm font-medium text-slate-200">Pilih gambar icon</span><span className="mt-0.5 block text-xs text-slate-500">PNG, JPG, atau SVG (maks. 2MB)</span></span><span className="rounded-lg bg-white/10 p-2 text-slate-400 [&>svg]:h-5 [&>svg]:w-5"><ImageIcon /></span><input type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={handleIconUpload} className="sr-only" /></label></Field>
              <div className="flex items-center justify-between rounded-xl bg-white/[0.04] p-4"><div><p className="text-sm font-semibold text-slate-200">Status Aktif</p><p className="mt-0.5 text-xs text-slate-500">Kategori aktif dapat ditampilkan pada kelas.</p></div><button type="button" role="switch" aria-checked={form.status === 'Aktif'} onClick={() => updateForm('status', form.status === 'Aktif' ? 'Draft' : 'Aktif')} className={`relative h-6 w-11 rounded-full transition ${form.status === 'Aktif' ? 'bg-violet-600' : 'bg-slate-600'}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${form.status === 'Aktif' ? 'left-6' : 'left-1'}`} /></button></div>
            </div>
            <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4"><button type="button" onClick={closeModal} className="h-10 rounded-xl border border-white/10 px-4 text-sm font-semibold text-slate-300 hover:bg-white/5">Batal</button><button type="submit" className="h-10 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white hover:bg-violet-500">{editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori'}</button></div>
          </form>
        </div>
      )}
    </main>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-200">{label}{required && <span className="ml-1 text-rose-400">*</span>}</span>{children}</label>
}

function CategoryIcon({ icon, name, small = false }: { icon?: string; name: string; small?: boolean }) {
  const sizeClass = small ? 'h-10 w-10 text-lg' : 'h-11 w-11 text-xl'
  const isImage = icon?.startsWith('blob:') || icon?.startsWith('http') || icon?.startsWith('data:')
  return <div className={`${sizeClass} flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-violet-500/15 font-semibold text-violet-300 [&>svg]:h-5 [&>svg]:w-5`} title={name}>{isImage ? <img src={icon} alt={name} className="h-full w-full object-cover" /> : icon || <ImageIcon />}</div>
}

function StatusBadge({ status }: { status: CategoryStatus }) {
  const active = status === 'Aktif'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${active ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/25' : 'bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-400/25'}`}>{status}</span>
}

function IconButton({ label, onClick, danger, children }: { label: string; onClick: () => void; danger?: boolean; children: ReactNode }) {
  return <button type="button" aria-label={label} title={label} onClick={onClick} className={`grid h-9 w-9 place-items-center rounded-lg transition [&>svg]:h-4 [&>svg]:w-4 ${danger ? 'text-rose-400 hover:bg-rose-500/10' : 'text-violet-300 hover:bg-violet-500/10'}`}>{children}</button>
}

export default CategoryManagementScreen
