import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const fallbackArticles = [
  {
    category: 'Kabar sekolah',
    date: '12 Juni 2024',
    title: 'Belajar dari lingkungan sekitar lewat Taman Belajar',
    excerpt: 'Ruang terbuka sekolah menjadi tempat anak mengamati, berdiskusi, dan menemukan cara baru untuk belajar bersama.',
    tone: 'mint',
  },
  {
    category: 'Kegiatan siswa',
    date: '28 Mei 2024',
    title: 'Menumbuhkan percaya diri lewat kegiatan seni',
    excerpt: 'Seni tari dan musik membuka ruang bagi siswa untuk berani tampil, menghargai proses, dan merayakan keberagaman bakat.',
    tone: 'yellow',
  },
  {
    category: 'Praktik baik',
    date: '08 Mei 2024',
    title: 'Kebiasaan kecil untuk sekolah yang lebih peduli',
    excerpt: 'Dari memilah sampah sampai merawat tanaman, kepedulian tumbuh lewat kebiasaan yang dilakukan bersama setiap hari.',
    tone: 'coral',
  },
]

function Artikel() {
  const [articles, setArticles] = useState(fallbackArticles)

  useEffect(() => {
    fetch('https://sdn1turi.my.id/api/articles.php')
      .then((response) => response.ok ? response.json() : null)
      .then((nextArticles) => {
        if (Array.isArray(nextArticles) && nextArticles.length > 0) setArticles(nextArticles)
      })
      .catch(() => {})
  }, [])

  return (
    <section className="container page article-page">
      <div className="page-heading article-heading">
        <p className="eyebrow">CERITA DARI SEKOLAH</p>
        <h1>Artikel</h1>
        <p className="lead">Kabar, kegiatan, dan ide kecil yang membuat kehidupan belajar di SD Negeri Turi 1 terus bergerak.</p>
      </div>
      <div className="article-intro">
        <div><span className="section-kicker"><span>01</span><span>JURNAL SEKOLAH</span></span><h2>Yang kami pelajari<br /><em>di luar kelas.</em></h2></div>
        <p>Setiap hari membawa cerita. Kami membagikan momen dan praktik baik dari warga sekolah agar keluarga dapat ikut dekat dengan proses tumbuh anak.</p>
      </div>
      <div className="article-grid">
        {articles.map((article, index) => (
          <article className={`article-card ${article.tone}`} key={article.title}>
            <div className="article-card-top"><span>0{index + 1}</span><span>{article.category}</span></div>
            <div className="article-card-body"><small>{article.article_date || article.date}</small><h3>{article.title}</h3><p>{article.excerpt}</p><Link className="article-link" to="/artikel">Baca cerita <span>-&gt;</span></Link></div>
          </article>
        ))}
      </div>
      <div className="article-note"><span className="panel-number">CATATAN</span><p>Artikel baru akan hadir seiring kegiatan dan cerita baik dari sekolah.</p></div>
    </section>
  )
}

export default Artikel