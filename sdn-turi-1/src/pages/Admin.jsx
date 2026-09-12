import { useEffect, useState } from 'react'
import { achievements, extracurriculars, schoolInfo, teachers } from '../data/schoolData'

const menuItems = ['Ringkasan', 'Profil Sekolah', 'Guru & Staf', 'Akademik', 'Fasilitas']
const facilitiesApiUrl = 'https://sdn1turi.my.id/api/facilities.php'

function Admin() {
  const [activeMenu, setActiveMenu] = useState('Ringkasan')
  const [facilities, setFacilities] = useState([])
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(true)
  const [facilitiesError, setFacilitiesError] = useState('')

  useEffect(() => {
    async function loadFacilities() {
      try {
        const response = await fetch(facilitiesApiUrl)

        if (!response.ok) {
          throw new Error('Data fasilitas tidak dapat dimuat.')
        }

        setFacilities(await response.json())
      } catch (requestError) {
        setFacilitiesError(requestError.message)
      } finally {
        setIsLoadingFacilities(false)
      }
    }

    loadFacilities()
  }, [])

  return (
    <section className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand"><span className="brand-mark">T1</span><div><strong>Admin Panel</strong><small>{schoolInfo.name}</small></div></div>
        <nav className="admin-menu" aria-label="Menu admin">
          {menuItems.map((item) => <button className={activeMenu === item ? 'admin-menu-item active' : 'admin-menu-item'} key={item} type="button" onClick={() => setActiveMenu(item)}><span>{item === 'Ringkasan' ? '◈' : item === 'Profil Sekolah' ? '◎' : item === 'Guru & Staf' ? '♙' : item === 'Akademik' ? '✦' : '□'}</span>{item}</button>)}
        </nav>
        <div className="admin-user"><div className="admin-avatar">SA</div><div><strong>Super Admin</strong><small>Administrator</small></div></div>
      </aside>
      <div className="admin-content">
        <header className="admin-topbar"><div><p className="eyebrow">PUSAT PENGELOLAAN</p><h1>Selamat datang, Admin</h1><p>Kelola informasi sekolah dari satu tempat.</p></div><button className="admin-action" type="button">+ Tambah konten</button></header>
        <div className="admin-breadcrumb">Dashboard <span>/</span> {activeMenu}</div>
        <div className="admin-stats"><StatCard label="Guru & Staf" value={teachers.length} note="data terdaftar" /><StatCard label="Ekstrakurikuler" value={extracurriculars.length} note="kegiatan aktif" /><StatCard label="Prestasi" value={achievements.length} note="pencapaian tercatat" /><StatCard label="Fasilitas" value={facilities.length} note="dari database" /></div>
        <div className="admin-grid"><section className="admin-panel"><div className="panel-heading"><div><h2>Informasi sekolah</h2><p>Data utama yang tampil di website publik.</p></div><button className="text-action" type="button">Edit data</button></div><div className="school-detail-grid"><Detail label="Nama sekolah" value={schoolInfo.name} /><Detail label="NPSN" value={schoolInfo.npsn} /><Detail label="Telepon" value={schoolInfo.phone} /><Detail label="Email" value={schoolInfo.email} /></div><div className="address-detail"><span>Alamat</span><strong>{schoolInfo.address}</strong></div></section><section className="admin-panel activity-panel"><div className="panel-heading"><div><h2>Aktivitas terbaru</h2><p>Pembaruan konten terakhir.</p></div></div><Activity title="Data fasilitas" time="Terhubung ke database" /><Activity title="Daftar prestasi" time="Data lokal" /><Activity title="Profil sekolah" time="Data lokal" /></section></div>
        <section className="admin-panel admin-facilities-panel"><div className="panel-heading"><div><h2>Fasilitas dari database</h2><p>Data berikut dibaca langsung dari MySQL melalui API.</p></div><button className="admin-action" type="button" disabled>+ Tambah fasilitas</button></div>{isLoadingFacilities && <p className="admin-status">Memuat data fasilitas...</p>}{facilitiesError && <p className="admin-status error">{facilitiesError}</p>}{!isLoadingFacilities && !facilitiesError && <div className="admin-facility-list">{facilities.map((facility) => <div className="admin-facility-row" key={facility.id}><div><strong>{facility.name}</strong><p>{facility.description}</p></div><span className="admin-badge">Database</span></div>)}</div>}</section>
      </div>
    </section>
  )
}

function StatCard({ label, value, note }) {
  return <article className="stat-card"><span>{label}</span><strong>{value}</strong><small>{note}</small></article>
}

function Detail({ label, value }) {
  return <div><span>{label}</span><strong>{value}</strong></div>
}

function Activity({ title, time }) {
  return <div className="activity-item"><span className="activity-dot" /><div><strong>{title}</strong><small>Diperbarui {time}</small></div><span className="activity-arrow">→</span></div>
}

export default Admin
