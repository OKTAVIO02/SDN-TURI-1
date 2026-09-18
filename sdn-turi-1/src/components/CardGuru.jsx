function CardGuru({ teacher, isActive = false }) {
  const photoSource = teacher.photo_url && (teacher.photo_url.startsWith('http') ? teacher.photo_url : `https://sdn1turi.my.id${teacher.photo_url}`)
  const fallbackInitial = teacher.name?.charAt(0) || '?'

  return <article className={`info-card teacher-card${isActive ? ' is-active' : ''}`}>{photoSource ? <img className="teacher-photo" src={photoSource} alt={`Foto ${teacher.name}`} onError={(event) => { event.currentTarget.style.display = 'none'; event.currentTarget.nextElementSibling.style.display = 'grid' }} /> : null}<div className="teacher-photo teacher-photo-fallback" style={{ display: photoSource ? 'none' : 'grid' }}><span>{fallbackInitial}</span></div><div className="teacher-card-copy"><h3>{teacher.name}</h3><p>{teacher.role}</p><small>{teacher.subject}</small></div></article>
}

export default CardGuru
