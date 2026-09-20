import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const apiOrigin = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'https://sdn1turi.my.id'
  : ''
const apiBaseUrl = `${apiOrigin}/api`
const sections = [
  { key: 'profile', label: 'Profil Sekolah', endpoint: 'school-profile.php' },
  { key: 'teachers', label: 'Guru & Staf', endpoint: 'teachers.php' },
  { key: 'extracurriculars', label: 'Ekstrakurikuler', endpoint: 'extracurriculars.php' },
  { key: 'achievements', label: 'Prestasi', endpoint: 'achievements.php' },
  { key: 'facilities', label: 'Fasilitas', endpoint: 'facilities.php' },
  { key: 'articles', label: 'Artikel', endpoint: 'articles.php' },
  { key: 'gallery', label: 'Galeri Sekolah', endpoint: 'gallery.php' },
  { key: 'contacts', label: 'Kontak Sekolah', endpoint: 'contacts.php' },
  { key: 'messages', label: 'Pesan Masuk', endpoint: 'messages.php' },
]

const dashboardSection = { key: 'dashboard', label: 'Ringkasan' }
const adminNavigation = [
  { ...dashboardSection, icon: '⌂' },
  { key: 'profile', label: 'Profil Sekolah', icon: '◎' },
  { key: 'teachers', label: 'Guru & Staf', icon: '♙' },
  { key: 'extracurriculars', label: 'Ekstrakurikuler', icon: '✦' },
  { key: 'achievements', label: 'Prestasi', icon: '✧' },
  { key: 'facilities', label: 'Fasilitas', icon: '□' },
  { key: 'articles', label: 'Artikel', icon: '▣' },
  { key: 'gallery', label: 'Galeri Sekolah', icon: '▧' },
  { key: 'contacts', label: 'Kontak Sekolah', icon: '☎' },
  { key: 'messages', label: 'Pesan Masuk', icon: '✉' },
]

const fallbackArticles = [
  {
    id: 1,
    category: 'Seni & Literasi',
    article_date: '21 Sep 2026',
    title: 'Siswa SD Negeri Turi 1 Panekan Raih Prestasi di Bidang Seni dan Literasi',
    excerpt: 'Keberanian siswa tampil di depan umum menjadi bukti bahwa bakat dan semangat belajar tumbuh sejak dini di SD Negeri Turi 1 Panekan.',
    tone: 'mint',
  },
  {
    id: 2,
    category: 'Olahraga',
    article_date: '21 Sep 2026',
    title: 'Semangat Bertanding, Siswa SD Negeri Turi 1 Panekan Ukir Prestasi di Bidang Olahraga',
    excerpt: 'Konsentrasi, strategi, dan semangat juang siswa SD Negeri Turi 1 Panekan terlihat jelas dalam prestasi catur dan atletik tingkat kecamatan.',
    tone: 'yellow',
  },
  {
    id: 3,
    category: 'Cerdas Cermat PAI',
    article_date: '21 Sep 2026',
    title: 'Tim Cerdas Cermat PAI SD Negeri Turi 1 Panekan Raih Juara 2',
    excerpt: 'Kerja sama tim, semangat belajar, dan persiapan matang menjadi kunci keberhasilan tim cerdas cermat PAI SD Negeri Turi 1 Panekan.',
    tone: 'coral',
  },
]

const resourceFields = {
  teachers: [{ key: 'name', label: 'Nama lengkap' }, { key: 'role', label: 'Jabatan' }, { key: 'subject', label: 'Bidang atau mata pelajaran' }, { key: 'photo', label: 'Foto profil (JPG, PNG, WebP; maksimal 5 MB)', type: 'file' }],
  extracurriculars: [{ key: 'name', label: 'Nama kegiatan' }, { key: 'description', label: 'Deskripsi' }],
  achievements: [{ key: 'title', label: 'Nama prestasi' }, { key: 'year', label: 'Tahun', type: 'number' }, { key: 'level', label: 'Tingkat' }],
  facilities: [{ key: 'name', label: 'Nama fasilitas' }, { key: 'description', label: 'Deskripsi' }, { key: 'condition_label', label: 'Kondisi fisik' }, { key: 'is_featured', label: 'Fasilitas unggulan (ketik 1 atau 0)', type: 'number' }],
  articles: [{ key: 'category', label: 'Kategori' }, { key: 'article_date', label: 'Tanggal artikel' }, { key: 'title', label: 'Judul' }, { key: 'excerpt', label: 'Ringkasan' }, { key: 'tone', label: 'Warna kartu (mint, yellow, atau coral)' }],
  gallery: [{ key: 'title', label: 'Judul dokumentasi' }, { key: 'description', label: 'Deskripsi', required: false }, { key: 'media', label: 'Foto atau video (foto maksimal 5 MB, video maksimal 50 MB)', type: 'file', accept: 'image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime', required: false }],
  contacts: [{ key: 'label', label: 'Nama kontak (contoh: Alamat, Telepon, Email)' }, { key: 'value', label: 'Isi kontak' }, { key: 'link_url', label: 'URL opsional (mailto:, tel:, atau Google Maps)', required: false }],
  messages: [{ key: 'name', label: 'Nama pengirim', required: false }, { key: 'email', label: 'Email pengirim', required: false }, { key: 'message', label: 'Isi pesan', required: false }],
}

async function readApiResponse(response, fallbackMessage) {
  const body = await response.text()
  let result = {}

  if (body) {
    try {
      result = JSON.parse(body)
    } catch {
      result = {}
    }
  }

  if (!response.ok) {
    throw new Error(result.error || `${fallbackMessage} (HTTP ${response.status})`)
  }

  return result
}

function Admin() {
  const navigate = useNavigate()
  const [activeKey, setActiveKey] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [data, setData] = useState({ teachers: [], extracurriculars: [], achievements: [], facilities: [], articles: [], gallery: [], contacts: [], messages: [], profile: null })
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const activeSection = activeKey === 'dashboard' ? dashboardSection : sections.find((section) => section.key === activeKey)

  async function logout() {
    await fetch(`${apiBaseUrl}/logout.php`, { credentials: 'include' })
    navigate('/admin/login', { replace: true })
  }

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const sessionResponse = await fetch(`${apiBaseUrl}/session.php`, { credentials: 'include' })
      if (!sessionResponse.ok) {
        navigate('/admin/login', { replace: true })
        return
      }
      const session = await sessionResponse.json()
      if (!session.authenticated) {
        navigate('/admin/login', { replace: true })
        return
      }
      const results = await Promise.all(sections.map(async (section) => {
        try {
          const response = await fetch(`${apiBaseUrl}/${section.endpoint}`, { credentials: 'include' })
          if (response.status === 401) return { section, unauthorized: true }
          if (!response.ok) return { section, error: `HTTP ${response.status}` }
          return { section, value: await response.json() }
        } catch {
          return { section, error: 'koneksi gagal' }
        }
      }))

      if (results.some((result) => result.unauthorized)) {
        navigate('/admin/login', { replace: true })
        return
      }

      const updates = results.reduce((result, item) => {
        if (!item.error) result[item.section.key] = item.value
        return result
      }, {})
      setData((currentData) => ({ ...currentData, ...updates }))

      const failedSections = results.filter((result) => result.error)
      setMessage(failedSections.length > 0
        ? `Sebagian data belum dimuat: ${failedSections.map((result) => `${result.section.label} (${result.error})`).join(', ')}.`
        : '')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    async function initializeData() {
      await loadData()
    }

    initializeData()
  }, [loadData])

  function selectSection(key) {
    setActiveKey(key)
    setIsSidebarOpen(false)
  }

  return <section className={`admin-shell${isSidebarOpen ? ' sidebar-open' : ''}`}><button className={`admin-menu-toggle${isSidebarOpen ? ' is-open' : ''}`} type="button" onClick={() => setIsSidebarOpen((isOpen) => !isOpen)} aria-label={isSidebarOpen ? 'Tutup navigasi admin' : 'Buka navigasi admin'} aria-expanded={isSidebarOpen}><span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" /></button><button className="admin-sidebar-backdrop" type="button" onClick={() => setIsSidebarOpen(false)} aria-label="Tutup navigasi admin" tabIndex={isSidebarOpen ? 0 : -1} /><AdminSidebar activeKey={activeKey} onSelect={selectSection} /><div className="admin-content"><header className="admin-topbar"><div><p className="eyebrow">PUSAT PENGELOLAAN</p><h1>{activeKey === 'dashboard' ? 'Kelola website sekolah' : activeSection.label}</h1><p>{activeKey === 'dashboard' ? 'Perbarui informasi yang tampil di website publik.' : `Kelola data ${activeSection.label.toLowerCase()} yang tampil di website publik.`}</p></div>{activeKey === 'dashboard' && <button className="admin-logout" type="button" onClick={logout} aria-label="Keluar dari panel admin" title="Keluar dari panel admin"><span aria-hidden="true">↪</span><span>Keluar</span></button>}</header>{activeKey === 'dashboard' ? <DashboardOverview onSelect={selectSection} /> : <><button className="admin-back-button" type="button" onClick={() => selectSection('dashboard')} aria-label="Kembali ke ringkasan" title="Kembali ke ringkasan"><span aria-hidden="true">&larr;</span></button><div className="admin-breadcrumb">Admin <span>/</span> {activeSection.label}</div>{isLoading ? <p className="admin-status">Memuat data dari database...</p> : activeKey === 'profile' ? <ProfileEditor key={data.profile?.id || 'profile'} profile={data.profile} onSaved={loadData} setMessage={setMessage} /> : <ResourceManager resource={activeKey} label={activeSection.label} items={data[activeKey]} fields={resourceFields[activeKey]} endpoint={activeSection.endpoint} onSaved={loadData} setMessage={setMessage} />}</>}{message && <p className="admin-status">{message}</p>}</div></section>
}

function AdminSidebar({ activeKey, onSelect }) {
  return <aside className="admin-sidebar" aria-label="Navigasi panel admin"><div className="admin-sidebar-brand"><img className="admin-brand-logo" src="/logo%20sdn.svg" alt="" /><div><strong>Admin Panel</strong><small>SD Negeri Turi 1</small></div></div><div className="admin-sidebar-heading">PENGELOLAAN</div><nav className="admin-sidebar-nav">{adminNavigation.map((item) => <button className={`admin-sidebar-item${activeKey === item.key ? ' is-active' : ''}`} key={item.key} type="button" onClick={() => onSelect(item.key)} aria-current={activeKey === item.key ? 'page' : undefined} title={item.label}><span className="admin-sidebar-icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span>{activeKey === item.key && <span className="admin-sidebar-indicator" aria-hidden="true" />}</button>)}</nav></aside>
}

function DashboardOverview({ onSelect }) {
  const cards = [
    { key: 'profile', icon: '◎', title: 'Profil, Kontak & Jam Layanan', text: 'Sesuaikan visi-misi, sambutan, alamat, email, dan nomor telepon sekolah.' },
    { key: 'teachers', icon: '♙', title: 'Guru & Staf', text: 'Tambah, edit nama, jabatan, bidang, dan foto guru sekolah.' },
    { key: 'extracurriculars', icon: '✦', title: 'Ekstrakurikuler', text: 'Kelola kegiatan dan program pengembangan siswa.' },
    { key: 'achievements', icon: '✧', title: 'Prestasi', text: 'Catat dan perbarui prestasi sekolah dan peserta didik.' },
    { key: 'facilities', icon: '□', title: 'Fasilitas', text: 'Perbarui daftar fasilitas dan kondisinya.' },
    { key: 'articles', icon: '▣', title: 'Artikel', text: 'Publikasikan berita dan artikel kegiatan sekolah.' },
    { key: 'gallery', icon: '▧', title: 'Galeri Sekolah', text: 'Kelola foto dan video dokumentasi sekolah.' },
    { key: 'contacts', icon: '☎', title: 'Kontak Sekolah', text: 'Atur alamat, telepon, email, dan tautan kontak.' },
    { key: 'messages', icon: '✉', title: 'Pesan Masuk', text: 'Lihat pesan yang dikirim melalui formulir kontak.' },
  ]

  return <div className="admin-dashboard"><div className="admin-overview-grid">{cards.map((card) => <button className="admin-overview-card" key={card.key} type="button" onClick={() => onSelect(card.key)}><span className="admin-overview-icon">{card.icon}</span><h3>{card.title}</h3><p>{card.text}</p><strong>Buka Kelola <span>-&gt;</span></strong></button>)}</div></div>
}

function ResourceManager({ resource, label, items, fields, endpoint, onSaved, setMessage }) {
  const [editing, setEditing] = useState(null)
  const [values, setValues] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  function startEdit(item = null) {
    setEditing(item?.id || null)
    setValues(fields.reduce((result, field) => ({ ...result, [field.key]: item?.[field.key] || '' }), {}))
  }

  async function save(event) {
    event.preventDefault()
    setIsSaving(true)
    try {
      if (resource === 'achievements' && (!values.title?.trim() || !values.year || Number(values.year) < 1900 || !values.level?.trim())) {
        throw new Error('Nama prestasi, tahun minimal 1900, dan tingkat wajib diisi.')
      }
      const isFileUpload = resource === 'teachers' || resource === 'gallery'
      const body = isFileUpload ? (() => {
        const formData = new FormData()
        Object.entries(values).forEach(([key, value]) => {
          if (!['photo', 'media'].includes(key) && value !== undefined && value !== null) formData.append(key, value)
        })
        formData.append('id', editing || '')
        if (resource === 'teachers' && values.photo instanceof File) formData.append('photo', values.photo)
        if (resource === 'gallery' && values.media instanceof File) formData.append('media', values.media)
        return formData
      })() : JSON.stringify({ ...values, id: editing })
      const response = await fetch(`${apiBaseUrl}/${endpoint}`, { method: 'POST', credentials: 'include', ...(isFileUpload ? {} : { headers: { 'Content-Type': 'application/json' } }), body })
      await readApiResponse(response, 'Data gagal disimpan.')
      setMessage(`${label} berhasil disimpan.`)
      setValues(null)
      setEditing(null)
      await onSaved()
    } catch (error) {
      setMessage(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function remove(id) {
    if (!window.confirm('Hapus data ini?')) return
    const response = await fetch(`${apiBaseUrl}/${endpoint}`, { method: 'DELETE', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    if (!response.ok) { setMessage(`Data gagal dihapus (HTTP ${response.status}).`); return }
    setMessage(`${label} berhasil dihapus.`)
    await onSaved()
  }

  const visibleItems = resource === 'articles' && (!items || items.length === 0) ? fallbackArticles : items

  return <section className="admin-panel content-manager"><div className="panel-heading"><div><h2>{label}</h2><p>{resource === 'messages' ? 'Pesan yang dikirim melalui formulir kontak website.' : 'Tambah, ubah, atau hapus data yang tampil di website.'}</p></div>{resource !== 'messages' && <button className="admin-action" type="button" onClick={() => startEdit()}>+ Tambah data</button>}</div>{values && <EditorForm fields={fields} values={values} setValues={setValues} isSaving={isSaving} onSubmit={save} onCancel={() => setValues(null)} />}<div className="manager-list">{visibleItems.map((item) => <div className="manager-row" key={item.id}><div><strong>{fields.map((field) => item[field.key]).filter(Boolean).join(' - ')}</strong>{resource !== 'achievements' && <p>{item.message || item.description || item.subject || item.role || item.excerpt}</p>}</div><div className="manager-actions">{resource !== 'messages' && <button type="button" onClick={() => startEdit(item)}>Edit</button>}<button type="button" onClick={() => remove(item.id)}>Hapus</button></div></div>)}</div></section>
}

function EditorForm({ fields, values, setValues, isSaving, onSubmit, onCancel }) {
  return <form className="admin-editor-form" onSubmit={onSubmit}>{fields.map((field) => <label key={field.key}>{field.label}{field.type === 'file' ? <input accept={field.accept || 'image/jpeg,image/png,image/webp'} required={field.required !== false && !values[field.key]} type="file" onChange={(event) => setValues({ ...values, [field.key]: event.target.files?.[0] || null })} /> : ['description', 'excerpt', 'message'].includes(field.key) ? <textarea required={field.required !== false} value={values[field.key]} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} /> : <input required={field.required !== false} type={field.type || 'text'} value={values[field.key]} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} />}</label>)}<div className="editor-actions"><button className="admin-action" type="submit" disabled={isSaving}>{isSaving ? 'Menyimpan...' : 'Simpan'}</button><button className="text-action" type="button" onClick={onCancel}>Batal</button></div></form>
}

function ProfileEditor({ profile, onSaved, setMessage }) {
  const fields = [{ key: 'name', label: 'Nama resmi sekolah' }, { key: 'npsn', label: 'NPSN' }, { key: 'address', label: 'Alamat' }, { key: 'phone', label: 'Nomor telepon' }, { key: 'email', label: 'Email' }, { key: 'vision', label: 'Visi' }, { key: 'mission', label: 'Misi (satu poin per baris)' }, { key: 'history', label: 'Sejarah singkat' }, { key: 'principal_welcome', label: 'Sambutan kepala sekolah' }]
  const emptyValues = fields.reduce((result, field) => ({ ...result, [field.key]: '' }), {})
  const [values, setValues] = useState(emptyValues)
  const [isSaving, setIsSaving] = useState(false)

  async function save(event) {
    event.preventDefault()
    setIsSaving(true)
    try {
      const response = await fetch(`${apiBaseUrl}/school-profile.php`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, id: profile?.id }) })
      await readApiResponse(response, 'Profil gagal disimpan.')
      setMessage('Profil sekolah berhasil disimpan.')
      await onSaved()
    } catch (error) { setMessage(error.message) } finally { setIsSaving(false) }
  }

  return <section className="admin-panel content-manager"><div className="panel-heading"><div><h2>Profil & identitas sekolah</h2><p>Kelola identitas, visi-misi, sejarah, dan sambutan kepala sekolah.</p></div></div><form className="admin-editor-form profile-editor" onSubmit={save}>{fields.map((field) => <label key={field.key}>{field.label}{['vision', 'mission', 'history', 'principal_welcome'].includes(field.key) ? <textarea required value={values[field.key]} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} /> : <input required type="text" value={values[field.key]} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} />}</label>)}<button className="admin-action" type="submit" disabled={isSaving}>{isSaving ? 'Menyimpan...' : 'Simpan profil'}</button></form></section>
}

export default Admin
