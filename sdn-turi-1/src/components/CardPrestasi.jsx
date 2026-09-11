function CardPrestasi({ achievement }) {
  return <article className="info-card"><small>{achievement.year} - {achievement.level}</small><h3>{achievement.title}</h3></article>
}

export default CardPrestasi
