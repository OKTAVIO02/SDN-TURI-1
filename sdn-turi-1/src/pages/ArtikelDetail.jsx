import { Link, useParams } from 'react-router-dom'
import { articleStories } from '../data/schoolData'

const renderInlineMarkdown = (text = '') => {
  const escaped = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  const withItalic = withBold.replace(/\*(.+?)\*/g, '<em>$1</em>')

  return <span dangerouslySetInnerHTML={{ __html: withItalic }} />
}

const renderStoryBlocks = (content = '') => {
  const blocks = content
    .trim()
    .split(/\n\s*\n+/)
    .filter(Boolean)

  return blocks.map((block, index) => {
    if (block.trim() === '---') {
      return <hr key={`divider-${index}`} className="story-divider" />
    }

    if (block.startsWith('### ')) {
      return (
        <h3 key={`heading-${index}`} className="story-article-subheading">
          {renderInlineMarkdown(block.replace(/^###\s*/, ''))}
        </h3>
      )
    }

    if (block.startsWith('# ')) {
      return (
        <h2 key={`heading-${index}`} className="story-article-heading">
          {renderInlineMarkdown(block.replace(/^#\s*/, ''))}
        </h2>
      )
    }

    if (block.startsWith('* ') || block.startsWith('- ')) {
      const items = block
        .split(/\n/)
        .map((line) => line.replace(/^\s*[-*]\s*/, '').trim())
        .filter(Boolean)

      return (
        <ul key={`list-${index}`} className="story-list">
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>
      )
    }

    if (/^\d+\.\s/.test(block)) {
      const items = block
        .split(/\n/)
        .map((line) => line.replace(/^\d+\.\s*/, '').trim())
        .filter(Boolean)

      return (
        <ol key={`list-${index}`} className="story-ordered-list">
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderInlineMarkdown(item)}</li>
          ))}
        </ol>
      )
    }

    return <p key={`paragraph-${index}`}>{renderInlineMarkdown(block)}</p>
  })
}

function ArtikelDetail() {
  const { slug } = useParams()
  const story = articleStories.find((item) => item.slug === slug) || articleStories[0]

  if (!story) {
    return (
      <section className="container page story-page">
        <div className="story-empty">
          <p className="eyebrow">CERITA TIDAK DITEMUKAN</p>
          <h1>Halaman cerita belum tersedia.</h1>
          <Link className="button" to="/artikel">Kembali ke artikel</Link>
        </div>
      </section>
    )
  }

  const relatedStories = articleStories.filter((item) => item.slug !== story.slug).slice(0, 2)

  return (
    <section className="container page story-page">
      <div className="story-breadcrumbs">
        <Link to="/">Beranda</Link>
        <span>/</span>
        <Link to="/artikel">Artikel</Link>
        <span>/</span>
        <strong>{story.label || 'Prestasi'}</strong>
      </div>

      <article className="story-article-card">
        <header className="story-article-header">
          <div className="story-meta-top">
            <span className="story-label">{story.category}</span>
            <div className="story-action-row" aria-label="Aksi artikel">
              <button type="button" className="story-action" aria-label="Suka artikel">♡</button>
              <button type="button" className="story-action" aria-label="Komentar artikel">💬</button>
              <button type="button" className="story-action" aria-label="Bagikan artikel">↗</button>
              <button type="button" className="story-action" aria-label="Simpan artikel">🔖</button>
            </div>
          </div>

          <h1>{story.title}</h1>

          <div className="story-meta-row">
            <span>Oleh {story.author}</span>
            <span>{story.article_date}</span>
            <span>{story.category}</span>
          </div>
        </header>

        <div className="story-featured-image-wrap">
          <img src={story.coverImage} alt={story.title} className="story-featured-image" />
          <p className="story-image-caption">{story.imageCaption}</p>
        </div>

        <div className="story-body">
          <p className="story-lead">{story.lead}</p>
          {renderStoryBlocks(story.content || story.story.join('\n\n'))}

          {story.highlights?.length > 0 && (
            <div className="story-highlights">
              <h3>Prestasi yang diraih</h3>
              <ul>
                {story.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {story.photos?.length > 0 && (
          <div className="story-gallery">
            {story.photos.map((photo) => (
              <figure className="story-photo" key={photo}>
                <img src={photo} alt={`${story.title} dokumentasi`} />
              </figure>
            ))}
          </div>
        )}
      </article>

      {relatedStories.length > 0 && (
        <div className="story-related">
          <div className="story-related-heading">
            <p className="eyebrow">ARTIKEL TERKAIT</p>
            <h2>Berita lain yang mungkin Anda baca</h2>
          </div>

          <div className="story-related-grid">
            {relatedStories.map((item) => (
              <article key={item.slug} className={`story-mini story-tone-${item.tone}`}>
                <img src={item.coverImage} alt={item.title} />
                <div className="story-mini-copy">
                  <small>{item.category}</small>
                  <h3>{item.title}</h3>
                  <Link to={`/artikel/${item.slug}`}>Baca artikel <span>→</span></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="story-footer-actions">
        <Link className="button" to="/artikel">Kembali ke Artikel</Link>
      </div>
    </section>
  )
}

export default ArtikelDetail
