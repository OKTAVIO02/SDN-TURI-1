import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { achievements, extracurriculars, facilities, schoolInfo } from '../data/schoolData'

function Home() {
  const [profile, setProfile] = useState(schoolInfo)
  const [homeData, setHomeData] = useState({ achievements, extracurriculars, facilities })

  useEffect(() => {
    Promise.all([
      fetch('https://sdn1turi.my.id/api/school-profile.php'),
      fetch('https://sdn1turi.my.id/api/achievements.php'),
      fetch('https://sdn1turi.my.id/api/extracurriculars.php'),
      fetch('https://sdn1turi.my.id/api/facilities.php'),
    ])
      .then(async ([profileResponse, achievementsResponse, extracurricularResponse, facilitiesResponse]) => {
        const [nextProfile, nextAchievements, nextExtracurriculars, nextFacilities] = await Promise.all([
          profileResponse.ok ? profileResponse.json() : null,
          achievementsResponse.ok ? achievementsResponse.json() : null,
          extracurricularResponse.ok ? extracurricularResponse.json() : null,
          facilitiesResponse.ok ? facilitiesResponse.json() : null,
        ])

        if (nextProfile) setProfile(nextProfile)
        setHomeData({
          achievements: nextAchievements || achievements,
          extracurriculars: nextExtracurriculars || extracurriculars,
          facilities: nextFacilities || facilities,
        })
      })
      .catch(() => {})
  }, [])

  return (
    <div className="home-template">
      <section className="container school-hero">
        <div className="school-hero-copy">
          <p className="eyebrow">SEKOLAH DASAR NEGERI TURI 1</p>
          <h1>Tempat tumbuhnya <em>mimpi</em> dan karakter.</h1>
          <p className="school-hero-lead">{profile.tagline || schoolInfo.tagline} Kami menghadirkan ruang belajar yang hangat, aktif, dan memberi setiap anak keberanian untuk berkembang.</p>
          <div className="hero-actions"><Link className="button" to="/profil">Jelajahi sekolah <span>-&gt;</span></Link><Link className="quiet-link" to="/fasilitas">Lihat fasilitas <span>-&gt;</span></Link></div>
          <div className="hero-trust"><span className="trust-mark">T1</span><span>Belajar dengan hati.<br /><strong>Bertumbuh bersama.</strong></span></div>
        </div>
        <div className="school-hero-visual" aria-label="Ruang belajar yang hangat dan menyenangkan"><div className="visual-topline"><span>RUANG BELAJAR</span><span>01 / 04</span></div><div className="visual-sun" /><div className="visual-arch" /><div className="visual-shelf"><i /><i /><i /><i /></div><div className="visual-card visual-card-main"><span className="visual-number">01</span><strong>Setiap anak punya<br />cara untuk bersinar.</strong><small>Ruang aman untuk belajar dan mencoba.</small></div><div className="visual-card visual-card-note"><span>PROGRAM</span><strong>Belajar aktif<br />setiap hari</strong></div><span className="visual-star">+</span><span className="visual-dot" /></div>
      </section>
      <section className="school-ribbon"><div className="container ribbon-grid"><div><strong>01</strong><span>Lingkungan belajar<br />yang suportif</span></div><div><strong>06+</strong><span>Ruang tumbuh<br />untuk setiap minat</span></div><div><strong>100%</strong><span>Komitmen untuk<br />masa depan anak</span></div><div className="ribbon-quote">&quot;Pendidikan dimulai<br />dari rasa percaya.&quot;</div></div></section>
      <section className="container home-section about-preview"><div className="section-kicker"><span>02</span><span>TENTANG SEKOLAH</span></div><div className="about-grid"><div><h2>Lebih dari sekadar tempat belajar.</h2><p className="section-lead">{profile.history}</p><Link className="text-link" to="/profil">Kenali identitas sekolah <span>-&gt;</span></Link></div><div className="about-note"><span className="note-label">NILAI KAMI</span><strong>Karakter baik.<br />Rasa ingin tahu.<br />Keberanian mencoba.</strong><div className="note-line" /></div></div></section>
      <section className="home-section program-section"><div className="container"><div className="section-heading"><div><div className="section-kicker"><span>03</span><span>RUANG UNTUK BERTUMBUH</span></div><h2>Program yang membuat<br /><em>belajar terasa dekat.</em></h2></div><p>Kegiatan akademik dan nonakademik dirancang untuk merawat rasa ingin tahu, kolaborasi, dan percaya diri.</p></div><div className="program-grid"><ProgramCard number="01" title="Belajar aktif" text="Pembelajaran yang mengajak anak bertanya, mencoba, dan menemukan." tone="mint" /><ProgramCard number="02" title="Bakat dan minat" text="Ruang bagi setiap anak untuk mengenal potensi dan mengekspresikannya." tone="yellow" /><ProgramCard number="03" title="Peduli sekitar" text="Menumbuhkan kebiasaan baik untuk menjaga lingkungan dan hidup bersama." tone="coral" /></div></div></section>
      <section className="container home-section snapshot-section"><div className="section-heading"><div><div className="section-kicker"><span>04</span><span>KEHIDUPAN SEKOLAH</span></div><h2>Yang sedang tumbuh<br /><em>di sekolah kami.</em></h2></div><Link className="text-link" to="/akademik">Lihat semua kegiatan <span>-&gt;</span></Link></div><div className="snapshot-grid"><div className="snapshot-feature"><span className="snapshot-label">PRESTASI TERBARU</span><strong>{homeData.achievements[0]?.title}</strong><small>{homeData.achievements[0]?.year} - {homeData.achievements[0]?.level}</small><span className="snapshot-arrow">-&gt;</span></div><div className="snapshot-list"><span className="snapshot-label">EKSTRAKURIKULER</span>{homeData.extracurriculars.slice(0, 4).map((item, index) => <div className="snapshot-item" key={item.id || item.name || item}><span>0{index + 1}</span><strong>{item.name || item}</strong><i>-&gt;</i></div>)}</div><div className="snapshot-list facilities-snapshot"><span className="snapshot-label">FASILITAS</span>{homeData.facilities.slice(0, 3).map((facility, index) => <div className="snapshot-item" key={facility.id || facility.name}><span>0{index + 1}</span><strong>{facility.name}</strong><i>-&gt;</i></div>)}</div></div></section>
      <section className="container home-cta"><div><span className="section-kicker"><span>05</span><span>SELAMAT DATANG</span></span><h2>Mari tumbuh<br /><em>bersama kami.</em></h2></div><div><p>Temukan cerita, kegiatan, dan kabar terbaru dari keluarga besar SD Negeri Turi 1.</p><Link className="button button-light" to="/profil">Mulai mengenal kami <span>-&gt;</span></Link></div></section>
    </div>
  )
}

function ProgramCard({ number, title, text, tone }) {
  return <article className={`program-card ${tone}`}><span>{number}</span><div className="program-icon">+</div><h3>{title}</h3><p>{text}</p><b>-&gt;</b></article>
}

export default Home
