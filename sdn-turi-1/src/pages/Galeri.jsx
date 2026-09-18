import { useEffect, useState } from 'react'

const galleryApiUrl = 'https://sdn1turi.my.id/api/gallery.php'
const mediaBaseUrl = 'https://sdn1turi.my.id'

function getMediaSource(mediaUrl) {
  return mediaUrl?.startsWith('http') ? mediaUrl : `${mediaBaseUrl}${mediaUrl}`
}

function Galeri() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(galleryApiUrl)
      .then((response) => {
        if (!response.ok) throw new Error('Dokumentasi galeri tidak dapat dimuat.')
        return response.json()
      })
      .then(setItems)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false))
  }, [])

  return <section className="container page gallery-page"><div className="page-heading"><p className="eyebrow">DOKUMENTASI SEKOLAH</p><h1>Galeri sekolah</h1><p className="lead">Potret kegiatan, karya, dan momen belajar bersama keluarga besar SD Negeri Turi 1.</p></div>{isLoading && <p className="lead">Memuat galeri...</p>}{error && <p className="lead">{error}</p>}{!isLoading && !error && items.length === 0 && <p className="lead">Dokumentasi sekolah akan segera hadir.</p>}{!isLoading && !error && items.length > 0 && <div className="gallery-grid">{items.map((item) => <article className="gallery-card" key={item.id}>{item.media_type === 'video' ? <video className="gallery-media" controls preload="metadata"><source src={getMediaSource(item.media_url)} /></video> : <img className="gallery-media" src={getMediaSource(item.media_url)} alt={item.title} />}<div className="gallery-card-copy"><span>{item.media_type === 'video' ? 'Video' : 'Foto'}</span><h2>{item.title}</h2>{item.description && <p>{item.description}</p>}</div></article>)}</div>}</section>
}

export default Galeri
