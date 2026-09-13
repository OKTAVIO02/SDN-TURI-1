function CardEkskul({ name, description }) {
  return <article className="info-card accent-card"><span className="card-icon">*</span><h3>{name}</h3><p>{description || 'Ruang tumbuh untuk bakat dan minat siswa.'}</p></article>
}

export default CardEkskul
