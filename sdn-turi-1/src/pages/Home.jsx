import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CardGuru from '../components/CardGuru'
import { achievements, extracurriculars, facilities, schoolInfo, teachers as defaultTeachers } from '../data/schoolData'

const articleCards = [
  {
    category: 'Berita',
    title: 'Belajar dari lingkungan sekitar lewat Taman Belajar',
    date: '12 Juni 2024',
    tone: 'mint',
  },
  {
    category: 'Kegiatan',
    title: 'Menumbuhkan percaya diri lewat kegiatan seni',
    date: '28 Mei 2024',
    tone: 'yellow',
  },
  {
    category: 'Praktik baik',
    title: 'Kebiasaan kecil untuk sekolah yang lebih peduli',
    date: '08 Mei 2024',
    tone: 'coral',
  },
]

const canonicalAddress = 'Jl. Turi No.2, Area Persawahan, Turi, Panekan, Kabupaten Magetan, Jawa Timur 63352'
const mediaBaseUrl = 'https://sdn1turi.my.id'

function getMediaSource(mediaUrl) {
  return mediaUrl?.startsWith('http') ? mediaUrl : `${mediaBaseUrl}${mediaUrl}`
}

function normalizeProfile(profileData) {
  return {
    ...schoolInfo,
    ...(profileData || {}),
    name: 'SD Negeri Turi 1',
    address: canonicalAddress,
  }
}

function Home() {
  const [profile, setProfile] = useState(schoolInfo)
  const [teachers, setTeachers] = useState(defaultTeachers)
  const [gallery, setGallery] = useState([])
  const [contacts, setContacts] = useState([])
  const [teacherSlide, setTeacherSlide] = useState(0)
  const [, setHomeData] = useState({ achievements, extracurriculars, facilities })
  const teacherSwipeStart = useRef(null)

  function handleTeacherPointerDown(event) {
    teacherSwipeStart.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  function handleTeacherPointerUp(event) {
    const start = teacherSwipeStart.current
    teacherSwipeStart.current = null
    if (!start) return

    const horizontalDistance = event.clientX - start.x
    const verticalDistance = event.clientY - start.y
    if (Math.abs(horizontalDistance) < 45 || Math.abs(horizontalDistance) <= Math.abs(verticalDistance)) return

    setTeacherSlide((currentSlide) => {
      const lastSlide = Math.max(teachers.length - 3, 0)
      return horizontalDistance < 0 ? Math.min(currentSlide + 1, lastSlide) : Math.max(currentSlide - 1, 0)
    })
  }

  function handleTeacherPointerCancel() {
    teacherSwipeStart.current = null
  }

  useEffect(() => {
    const revealElements = document.querySelectorAll('.scroll-reveal')

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting)
      })
    }, { threshold: 0.14 })

    revealElements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    Promise.all([
      fetch('https://sdn1turi.my.id/api/school-profile.php'),
      fetch('https://sdn1turi.my.id/api/achievements.php'),
      fetch('https://sdn1turi.my.id/api/extracurriculars.php'),
      fetch('https://sdn1turi.my.id/api/facilities.php'),
      fetch('https://sdn1turi.my.id/api/teachers.php'),
      fetch('https://sdn1turi.my.id/api/gallery.php'),
      fetch('https://sdn1turi.my.id/api/contacts.php'),
    ])
      .then(async ([profileResponse, achievementsResponse, extracurricularResponse, facilitiesResponse, teachersResponse, galleryResponse, contactsResponse]) => {
        const [nextProfile, nextAchievements, nextExtracurriculars, nextFacilities, nextTeachers, nextGallery, nextContacts] = await Promise.all([
          profileResponse.ok ? profileResponse.json() : null,
          achievementsResponse.ok ? achievementsResponse.json() : null,
          extracurricularResponse.ok ? extracurricularResponse.json() : null,
          facilitiesResponse.ok ? facilitiesResponse.json() : null,
          teachersResponse.ok ? teachersResponse.json() : null,
          galleryResponse.ok ? galleryResponse.json() : null,
          contactsResponse.ok ? contactsResponse.json() : null,
        ])

        if (nextProfile) setProfile(normalizeProfile(nextProfile))
        if (Array.isArray(nextTeachers) && nextTeachers.length > 0) setTeachers(nextTeachers)
        if (Array.isArray(nextGallery)) setGallery(nextGallery)
        if (Array.isArray(nextContacts)) setContacts(nextContacts)
        setHomeData({
          achievements: nextAchievements || achievements,
          extracurriculars: nextExtracurriculars || extracurriculars,
          facilities: nextFacilities || facilities,
        })
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const maxSlide = Math.max(teachers.length - 3, 0)
    if (maxSlide === 0) return undefined

    const slideTimer = window.setInterval(() => {
      setTeacherSlide((currentSlide) => (currentSlide >= maxSlide ? 0 : currentSlide + 1))
    }, 5500)

    return () => window.clearInterval(slideTimer)
  }, [teachers.length])

  return (
    <div className="home-template">
      <header className="school-hero-shell">
        <video className="school-hero-video" autoPlay muted loop playsInline aria-hidden="true">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="container school-hero">
          <div className="school-hero-copy hero-stagger">
            <span className="hero-badge">Selamat datang di</span>
            <h1>SD Negeri Turi 1</h1>
            <p className="school-hero-lead">{profile.tagline || schoolInfo.tagline} Kami menghadirkan lingkungan belajar yang hangat, aktif, dan aman untuk merawat semangat belajar setiap anak.</p>
            <div className="hero-actions">
              <Link className="button" to="/profil">Visi &amp; Misi <span>-&gt;</span></Link>
              <Link className="quiet-link" to="/fasilitas">Fasilitas <span>-&gt;</span></Link>
            </div>
          </div>

          <div className="school-hero-visual hero-stagger" aria-label="Logo SD Negeri Turi 1">
            <img className="school-emblem" src="/logo%20sdn.svg" alt="Logo SD Negeri Turi 1" />
          </div>
        </div>

      </header>

      <main>
        <section className="container home-section welcome-section scroll-reveal">
          <div className="section-header center">
            <p className="eyebrow">Sambutan Kepala Sekolah</p>
            <h2>Selamat datang di sekolah kami</h2>
          </div>

          <div className="welcome-card">
            <div className="welcome-avatar">
              <img src="/kepala-sekolah.jpg" alt="Kepala Sekolah SD Negeri Turi 1" />
            </div>
            <div className="welcome-copy">
              <p>
                Assalamualaikum Wr. Wb. Kami sangat bangga menyambut keluarga besar SD Negeri Turi 1.
                Di sini, proses belajar tidak hanya menuntut kecerdasan, tetapi juga menumbuhkan karakter,
                kejujuran, kebersamaan, dan semangat untuk terus berkembang. Kami berharap sekolah ini
                menjadi rumah belajar yang aman, menyenangkan, dan penuh inspirasi untuk masa depan anak-anak kita.
              </p>
              <div className="signer">
                <strong>Aris Wibowo, S.Pd.</strong>
                <span>Kepala SD Negeri Turi 1</span>
              </div>
            </div>
          </div>
        </section>

        <section className="container home-section news-section scroll-reveal">
          <div className="section-header center">
            <p className="eyebrow">Artikel &amp; Berita</p>
            <h2>Informasi terbaru sekolah</h2>
          </div>

          <div className="news-grid">
            {articleCards.map((item) => (
              <article key={item.title} className={`news-card ${item.tone}`}>
                <div className="news-illustration" aria-hidden="true" />
                <div className="news-meta">
                  <span>{item.category}</span>
                  <small>{item.date}</small>
                </div>
                <h3>{item.title}</h3>
                <Link className="text-link" to="/artikel">Selengkapnya <span>-&gt;</span></Link>
              </article>
            ))}
          </div>
        </section>

        <section className="container home-section video-section scroll-reveal">
          <div className="section-header center">
            <p className="eyebrow">Profile Sekolah</p>
            <h2>Video Profil Sekolah</h2>
          </div>

          <div className="video-frame">
            <a className="video-play" href="https://www.youtube.com/results?search_query=SD+Negeri+Turi+1" target="_blank" rel="noreferrer" aria-label="Cari video SD Negeri Turi 1 di YouTube">▶</a>
            <div className="video-caption">Pemanfaatan Sarana dan Prasarana Sekolah</div>
          </div>

          <div className="video-meta">
            <div>
              <strong>Profil Resmi SD Negeri Turi 1</strong>
              <p>Video singkat tentang fasilitas, program, dan kegiatan siswa yang menjadi bagian dari proses belajar di sekolah kami.</p>
            </div>
            <div className="video-actions">
              <a href="https://www.youtube.com/results?search_query=SD+Negeri+Turi+1" target="_blank" rel="noreferrer">Channel Sekolah</a>
              <a href="https://www.youtube.com/results?search_query=SD+Negeri+Turi+1" target="_blank" rel="noreferrer">Buka di YouTube</a>
            </div>
          </div>
        </section>

        <section className="container home-section home-gallery-section scroll-reveal">
          <div className="section-header center">
            <p className="eyebrow">Dokumentasi Sekolah</p>
            <h2>Momen yang kami abadikan</h2>
          </div>

          {gallery.length > 0 ? <>
            <div className="gallery-grid home-gallery-grid">
              {gallery.slice(0, 4).map((item) => <article className="gallery-card" key={item.id}>
                {item.media_type === 'video' ? <video className="gallery-media" controls preload="metadata"><source src={getMediaSource(item.media_url)} /></video> : <img className="gallery-media" src={getMediaSource(item.media_url)} alt={item.title} />}
                <div className="gallery-card-copy"><span>{item.media_type === 'video' ? 'Video' : 'Foto'}</span><h2>{item.title}</h2></div>
              </article>)}
            </div>
            <Link className="teacher-more-link gallery-more-link" to="/galeri">Lihat semua galeri <span>-&gt;</span></Link>
          </> : <p className="lead gallery-empty">Dokumentasi sekolah akan segera hadir.</p>}
        </section>

        <section className="teacher-section scroll-reveal">
          <div className="container teacher-section-wrap">
            <div className="section-header center">
              <p className="eyebrow">Guru &amp; Staff</p>
              <h2>Orang-orang di balik sekolah kami</h2>
            </div>

            <div className="teacher-carousel">
              <button className="carousel-button carousel-prev" type="button" onClick={() => setTeacherSlide((currentSlide) => Math.max(currentSlide - 1, 0))} aria-label="Guru sebelumnya">&larr;</button>
              <div className="teacher-viewport" onPointerDown={handleTeacherPointerDown} onPointerUp={handleTeacherPointerUp} onPointerCancel={handleTeacherPointerCancel}>
                <div className="teacher-track" style={{ '--teacher-slide': teacherSlide }}>
                  {teachers.map((teacher, index) => <CardGuru key={teacher.id || `${teacher.name}-${index}`} teacher={teacher} isActive={index === teacherSlide + 1} />)}
                </div>
              </div>
              <button className="carousel-button carousel-next" type="button" onClick={() => setTeacherSlide((currentSlide) => Math.min(currentSlide + 1, Math.max(teachers.length - 3, 0)))} aria-label="Guru berikutnya">&rarr;</button>
            </div>

            <div className="carousel-dots" aria-label="Posisi carousel guru">
              {Array.from({ length: Math.max(teachers.length - 2, 1) }, (_, index) => <button key={index} className={index === teacherSlide ? 'is-active' : ''} type="button" onClick={() => setTeacherSlide(index)} aria-label={`Buka slide ${index + 1}`} />)}
            </div>
            <Link className="teacher-more-link" to="/profil">Lihat semua guru <span>-&gt;</span></Link>
          </div>
        </section>

        <section id="kontak" className="container home-section contact-section scroll-reveal">
          <div className="contact-panel">
            <div className="contact-copy">
              <p className="eyebrow">Informasi Kontak</p>
              {(contacts.length > 0 ? contacts : [{ label: 'Alamat', value: profile.address || schoolInfo.address }, { label: 'Telepon', value: profile.phone || schoolInfo.phone }, { label: 'Email', value: profile.email || schoolInfo.email }]).map((contact) => <div key={contact.id || contact.label}><h3>{contact.label}</h3>{contact.link_url ? <a href={contact.link_url} target={contact.link_url.startsWith('http') ? '_blank' : undefined} rel={contact.link_url.startsWith('http') ? 'noreferrer' : undefined}>{contact.value}</a> : <p>{contact.value}</p>}</div>)}
              <a className="button ghost-button" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${profile.name || schoolInfo.name}, ${(contacts.find((contact) => contact.label.toLowerCase().includes('alamat'))?.value || profile.address || schoolInfo.address)}`)}`} target="_blank" rel="noreferrer">Lihat di Google Maps</a>
            </div>
            <div className="map-box" aria-label="Peta lokasi sekolah">
              <iframe
                title="Lokasi SD Negeri Turi 1"
                src={`https://www.google.com/maps?q=${encodeURIComponent(`${profile.name || schoolInfo.name}, ${profile.address || schoolInfo.address}`)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home