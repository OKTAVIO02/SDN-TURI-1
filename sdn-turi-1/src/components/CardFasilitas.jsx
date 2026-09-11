function CardFasilitas({ facility }) {
  return <article className="info-card facility-card"><span className="card-icon">[]</span><div><h3>{facility.name}</h3><p>{facility.description}</p></div></article>
}

export default CardFasilitas
