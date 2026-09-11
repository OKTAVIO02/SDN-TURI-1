function CardGuru({ teacher }) {
  return <article className="info-card"><div className="avatar">{teacher.name.charAt(0)}</div><h3>{teacher.name}</h3><p>{teacher.role}</p><small>{teacher.subject}</small></article>
}

export default CardGuru
