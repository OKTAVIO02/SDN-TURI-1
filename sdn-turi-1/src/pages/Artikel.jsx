import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { articleStories } from '../data/schoolData'

const fallbackArticles = articleStories

const fallbackArticleImages = [
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
]

const getArticleImage = (article, index) => {
  const candidate = article?.coverImage || article?.cover_image || article?.image_url || article?.photo_url || article?.image || article?.thumbnail

  if (candidate && typeof candidate === 'string' && candidate.trim()) {
    return candidate
  }

  return fallbackArticleImages[index % fallbackArticleImages.length]
}

function Artikel() {
  const [articles, setArticles] = useState(fallbackArticles)

  useEffect(() => {
    fetch('https://sdn1turi.my.id/api/articles.php')
      .then((response) => response.ok ? response.json() : null)
      .then((nextArticles) => {
        if (Array.isArray(nextArticles) && nextArticles.length > 0) {
          setArticles(nextArticles.map((article, index) => ({
            ...article,
            coverImage: getArticleImage(article, index),
            tone: article.tone || ['mint', 'yellow', 'coral'][index % 3],
            slug: article.slug || article.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '') || `artikel-${index + 1}`,
          })))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section className="container page article-page">
      <div className="page-heading article-heading">
        <p className="eyebrow">CERITA DARI SEKOLAH</p>
        <h1>Artikel</h1>
        <p className="lead">Kabar, kegiatan, dan prestasi siswa yang membuat semangat belajar di SD Negeri Turi 1 semakin hidup.</p>
      </div>

      <div className="article-breadcrumbs">
        <Link to="/">Beranda</Link>
        <span>/</span>
        <span>Artikel</span>
        <span>/</span>
        <strong>Prestasi</strong>
      </div>

      <div className="article-grid article-grid-news">
        {articles.map((article, index) => (
          <article className={`article-card article-news-card ${article.tone || ['mint', 'yellow', 'coral'][index % 3]}`} key={article.slug || article.title}>
            <div className="article-card-image-wrap">
              <img src={getArticleImage(article, index)} alt={article.title} className="article-card-image" />
            </div>
            <div className="article-card-content">
              <div className="article-card-top">
                <span>{article.category}</span>
                <small>{article.article_date || article.date}</small>
              </div>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <div className="article-card-footer">
                <span>0{index + 1}</span>
                <Link className="article-link" to={`/artikel/${article.slug || article.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '')}`}>Baca artikel <span>-&gt;</span></Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Artikel