function CardGuru({ teacher }) {
  const photoSource = teacher.photo_url && (teacher.photo_url.startsWith('http') ? teacher.photo_url : `https://sdn1turi.my.id${teacher.photo_url}`)

  return <article className="info-card teacher-card">{photoSource ? <img className="teacher-photo" src={photoSource} alt={`Foto ${teacher.name}`} /> : <div className="teacher-photo teacher-photo-fallback"><span>{teacher.name.charAt(0)}</span></div>}<div className="teacher-card-copy"><h3>{teacher.name}</h3><p>{teacher.role}</p><small>{teacher.subject}</small></div></article>
}

export default CardGuru
